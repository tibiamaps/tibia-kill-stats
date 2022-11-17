import fs from 'node:fs/promises';
import glob from 'glob';
import jsesc from 'jsesc';
import { toPrettyName } from './normalize-names.mjs';

// race => totalKilled
const map = new Map();

const handleFile = async (fileName) => {
	const json = await fs.readFile(fileName, 'utf8');
	const entries = JSON.parse(json).killstatistics.entries;
	for (const {race, last_day_killed} of entries) {
		if (map.has(race)) {
			const prev = map.get(race);
			map.set(race, prev + last_day_killed);
		} else {
			map.set(race, last_day_killed);
		}
	}
};

const fileNames = glob.sync('./data/*/*.json', {
	ignore: './data/_global-total/*.json',
});
for (const fileName of fileNames) {
	await handleFile(fileName);
}

{
	const KILL_STATS_NAMES = [...map.keys()].sort();
	const json = jsesc(KILL_STATS_NAMES, {
		json: true,
		compact: false,
	});
	await fs.writeFile('./data/_global-total/names.json', `${json}\n`);
}

const entries = [...map.entries()];
const sorted = entries
	.filter(entry => entry[1] > 0)
	.map(([race, kills]) => {
		return [toPrettyName(race), kills];
	})
	.sort((a, b) => {
	if (a[1] === b[1]) {
		return a[0].localeCompare(b[0]);
	}
	return a[1] - b[1];
});

{
	const json = jsesc(Object.fromEntries(sorted), {
		json: true,
		compact: false,
	});
	await fs.writeFile('./data/_global-total/kills.json', `${json}\n`);
}
