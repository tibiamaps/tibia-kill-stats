import * as fs from 'node:fs/promises';

const API_URL = 'https://api.tibiadata.com/v5';

const slugify = (name) => {
	const slug = name.replaceAll(' ', '+');
	return slug;
};

const fetchJson = async (url) => {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`TibiaData API returned HTTP ${response.status} ${response.statusText} for ${url}`);
	}
	return response.json();
};

const getWorlds = async () => {
	console.log('Getting list of Tibia worlds…');
	const data = await fetchJson(`${API_URL}/worlds`);
	const regularWorlds = data.worlds.regular_worlds;
	const worldNames = regularWorlds.map((world) => world.name);
	return worldNames;
};

const getKillStatsForWorld = async (worldName) => {
	const data = await fetchJson(`${API_URL}/killstatistics/${slugify(worldName)}`);
	console.log(`Processing kill stats for world ${worldName}…`);
	return data;
};

const doesFileExist = async (path) => {
	try {
		await fs.stat(path);
		return true;
	} catch {
		return false;
	}
};

const date = new Date().toISOString().slice(0, 'yyyy-mm-dd'.length);
if (await doesFileExist(`./data/antica/${date}.json`)) {
	console.log(`Stats for ${date} are already checked in. Nothing to do.`);
	process.exit();
}

const worldNames = await getWorlds();
// Kick off all requests in parallel.
const killStatsPerWorld = worldNames.map((worldName) => getKillStatsForWorld(worldName));

for await (const stats of killStatsPerWorld) {
	const world = stats.killstatistics.world;

	const worldPath = `./data/${world.toLowerCase()}`;
	await fs.mkdir(worldPath, {
		recursive: true,
	});

	const json = JSON.stringify(stats, null, '\t') + '\n';
	await fs.writeFile(`${worldPath}/${date}.json`, json);
}
