import fs from 'node:fs/promises';
import glob from 'glob';

// legacyKillStatsName => newKillStatsName
const map = new Map([
	['Bloodjaws', 'bloodjaws'],
	['Elder Bloodjaws', 'elder bloodjaws'],
]);

const handleFile = async (fileName) => {
	const json = await fs.readFile(fileName, 'utf8');
	const data = JSON.parse(json);
	const indicesToDelete = [];
	let hasChanges = false;

	// Find all the races and their indices in this data file, so we can
	// figure out whether we need to merge or simply rename in-place.
	const raceToIndex = new Map();
	for (const [index, entry] of data.killstatistics.entries.entries()) {
		raceToIndex.set(entry.race, index);
	}

	// In case both legacy and new entries exist, merge them.
	// Otherwise, rename the legacy entry in-place.
	for (const [index, entry] of data.killstatistics.entries.entries()) {
		const race = entry.race;
		if (map.has(race)) {
			hasChanges = true;
			const newName = map.get(race);
			if (raceToIndex.has(newName)) {
				const newEntryIndex = raceToIndex.get(newName);
				const newEntry = data.killstatistics.entries[newEntryIndex];
				newEntry.last_day_players_killed += entry.last_day_players_killed;
				newEntry.last_day_killed += entry.last_day_killed;
				newEntry.last_week_players_killed += entry.last_week_players_killed;
				newEntry.last_week_killed += entry.last_week_killed;
				indicesToDelete.push(index);
			} else {
				entry.race = newName;
			}
		}
	}

	if (!hasChanges) {
		return;
	}

	// Delete any old entries.
	for (const [index, indexToDelete] of indicesToDelete.entries()) {
		// Note: every deletion reindexes the array.
		data.killstatistics.entries.splice(indexToDelete - index, 1);
	}

	const updatedJson = JSON.stringify(data, null, '\t');
	await fs.writeFile(fileName, `${updatedJson}\n`);
};

const fileNames = glob.sync('./data/*/*.json', {
	ignore: [
		'./data/*/latest.json',
		'./data/_global-total/*.json',
		'./data/_yesterday/*.json',
	],
});
for (const fileName of fileNames) {
	await handleFile(fileName);
}
