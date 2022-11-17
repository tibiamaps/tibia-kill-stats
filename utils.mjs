import fs from 'node:fs/promises';
import jsesc from 'jsesc';

const readKillStats = async () => {
	const filePath = './data/_global-total/kills.json';
	const json = await fs.readFile(filePath);
	const object = JSON.parse(json);
	const entries = Object.entries(object);
	const map = new Map(entries);
	return map;
};

const GLOBAL_TOTAL_KILLS = await readKillStats();

export const createKillsPerCategoryMap = (creaturesPerCategory) => {
	const GLOBAL_TOTAL_KILLS_PER_CATEGORY = new Map();
	const categories = [...creaturesPerCategory.keys()];
	for (const category of categories) {
		GLOBAL_TOTAL_KILLS_PER_CATEGORY.set(category, new Map());
	}

	for (const [race, kills] of GLOBAL_TOTAL_KILLS) {
		for (const category of categories) {
			const creatures = creaturesPerCategory.get(category);
			if (creatures.has(race)) {
				GLOBAL_TOTAL_KILLS_PER_CATEGORY.get(category).set(race, kills);
			}
		}
	}

	for (const category of categories) {
		const expectedCreatures = creaturesPerCategory.get(category);
		const actualCreatures = new Set(
			GLOBAL_TOTAL_KILLS_PER_CATEGORY.get(category).keys()
		);
		const expectedSize = expectedCreatures.size;
		const actualSize = actualCreatures.size;
		if (actualSize < expectedSize) {
			const difference = new Set(
				[...expectedCreatures].filter(creature => !actualCreatures.has(creature))
			);
			console.log(`Category ${category}: expected ${expectedSize} entries but got only ${actualSize}. Missing entries:`, difference);
		}
	}

	return GLOBAL_TOTAL_KILLS_PER_CATEGORY;
};

export const writeMap = async (map, slug) => {
	const json = jsesc(Object.fromEntries(map), {
		json: true,
		compact: false,
	});
	await fs.writeFile(`./data/_global-total/${slug}-kills.json`, `${json}\n`);
};
