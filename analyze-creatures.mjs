import { createKillsPerCategoryMap, writeMap } from './utils.mjs';

// prettier-ignore
const CREATURES_PER_CATEGORY = new Map([

	// Bestiary categories, per number of kills needed.

	// https://tibiadraptor.com/bestiary?kills=5&sortBy=name
	['very-rare-bestiary-creature', new Set([
		'acolyte of darkness',
		'bane bringer',
		'bane of light',
		'berrypest',
		'bride of night',
		'cake golem',
		'crustacea gigantica',
		'crystal wolf',
		'diamond servant',
		'dire penguin',
		'doomsday cultist',
		'draptor',
		'dryad',
		'duskbringer',
		'elf overseer',
		'goblin leader',
		'golden servant',
		'grynch clan goblin',
		'herald of gloom',
		'iks ahpututu',
		'iron servant',
		'midnight panther',
		'midnight spawn',
		'midnight warrior',
		'nightfiend',
		'nightslayer',
		'raging fire',
		'shadow hound',
		'thornfire wolf',
		'troll guard',
		'undead cavebear',
		'undead jester',
		'vicious manbat',
		'water buffalo',
		'wild horse',
		'yeti',
	])],

	// https://tibiadraptor.com/bestiary?kills=25&sortBy=name
	['harmless-bestiary-creature', new Set([
		'berrypest',
		// The kill stats do not distinguish between blue, purple, or
		// red butterflies.
		'butterfly',
		'cat',
		'chocolate blob',
		'cream blob',
		'dog',
		'fruit drop',
		'gingerbread man',
		'husky',
		'modified gnarlhound',
		'mushroom sniffer',
		'northern pike',
		'pigeon',
		'sugar cube',
		'sugar cube worker',
		'truffle',
		'truffle cook',
		'wafer paper butterfly',
	])],

	// https://tibiadraptor.com/bestiary?kills=250&sortBy=name
	['trivial-bestiary-creature', new Set([
		'agrestic chicken',
		'badger',
		'bat',
		'black sheep',
		'bog frog',
		'bug',
		'cave parrot',
		'cave rat',
		'chicken',
		'deer',
		'dromedary',
		'fish',
		'flamingo',
		'fox',
		'frost troll',
		'goblin',
		'green frog',
		// The kill stats do not distinguish between brown,
		// grey, or taupe horses.
		'horse',
		'island troll',
		'parrot',
		'penguin',
		'pig',
		'poison spider',
		'rabbit',
		'rat',
		'sandcrawler',
		'seagull',
		'sheep',
		'silver rabbit',
		'skunk',
		'snake',
		'spider',
		'squirrel',
		'troll',
		'wasp',
		'white deer',
		'winter wolf',
		'wisp',
		'wolf',
	])],

	// https://tibiadraptor.com/bestiary?kills=500&sortBy=name
	['easy-bestiary-creature', new Set([
		'abyssal calamary',
		'adventurer',
		'amazon',
		'assassin',
		'azure frog',
		'bandit',
		'barbarian brutetamer',
		'barbarian headsplitter',
		'barbarian skullhunter',
		'bear',
		'blood crab',
		'boar',
		'bonelord',
		'calamary',
		'carrion worm',
		'centipede',
		'chakoya toolshaper',
		'chakoya tribewarden',
		'chakoya windcaller',
		'cobra',
		'coral frog',
		'corym charlatan',
		'crab',
		'crazed beggar',
		'crimson frog',
		'crocodile',
		'crypt defiler',
		'crypt shambler',
		'cyclops',
		'damaged crystal golem',
		'damaged worker golem',
		'dark apprentice',
		'dark magician',
		'dark monk',
		'deepling worker',
		'deepsea blood crab',
		'dwarf guard',
		'dwarf soldier',
		'dwarf',
		'dworc fleshhunter',
		'dworc venomsniper',
		'dworc voodoomaster',
		'elephant',
		'elf arcanist',
		'elf scout',
		'elf',
		'emerald damselfly',
		'feverish citizen',
		'filth toad',
		'fire devil',
		'firestarter',
		'frost giant',
		'frost giantess',
		'furious troll',
		'gang member',
		'gargoyle',
		'gazer',
		'ghost wolf',
		'ghost',
		'ghoul',
		'gladiator',
		'gloom wolf',
		'gnarlhound',
		'goblin assassin',
		'goblin scavenger',
		'gozzler',
		'grave robber',
		'honour guard',
		'hunter',
		'hyaena',
		'insect swarm',
		'insectoid scout',
		'jellyfish',
		'killer rabbit',
		'kongra',
		'ladybug',
		'larva',
		'leaf golem',
		'lion',
		'little corym charlatan',
		'lizard sentinel',
		'lizard templar',
		'mad scientist',
		'mammoth',
		'marsh stalker',
		'mercury blob',
		'merlkin',
		'minotaur archer',
		'minotaur guard',
		'minotaur mage',
		'minotaur',
		'mole',
		'monk',
		'mummy',
		// The kill stats do not distinguish between basic, blue, or red/female nomads.
		'nomad',
		'novice of the cult',
		'orc rider',
		'orc shaman',
		'orc spearman',
		'orc warrior',
		'orc',
		'orchid frog',
		'panda',
		'pirate ghost',
		'pirate marauder',
		'pirate skeleton',
		'poacher',
		'polar bear',
		'quara mantassin scout',
		'redeemed soul',
		'rorc',
		'rotworm',
		'salamander',
		'scarab',
		'scorpion',
		'sibang',
		'skeleton warrior',
		'skeleton',
		'slime',
		'slug',
		'smuggler',
		'spit nettle',
		'squidgy slime',
		'stalker',
		'starving wolf',
		'stone golem',
		'swamp troll',
		'swampling',
		'tainted soul',
		'tarantula',
		'tarnished spirit',
		'terramite',
		'terrified elephant',
		'terror bird',
		'thornback tortoise',
		'tiger',
		'toad',
		'tortoise',
		'troll champion',
		'undead mine worker',
		'undead prospector',
		'valkyrie',
		'war wolf',
		'white shade',
		'white tiger',
		'wild warrior',
		'witch',
	])],

	// https://tibiadraptor.com/bestiary?kills=1000&sortBy=name
	['medium-bestiary-creature', new Set([
		'acid blob',
		'acolyte of the cult',
		'adept of the cult',
		'ancient scarab',
		'animated snowman',
		'arctic faun',
		'askarak demon',
		'askarak lord',
		'askarak prince',
		'baleful bunny',
		'banshee',
		'barbarian bloodwalker',
		'barkless devotee',
		'barkless fanatic',
		'behemoth',
		'bellicose orger',
		'berserker chicken',
		'betrayed wraith',
		'blood beast',
		'blood hand',
		'blood priest',
		'blue djinn',
		'bog raider',
		'bonebeast',
		'boogy',
		'braindeath',
		'brimstone bug',
		'broken shaper',
		'carniphila',
		'clay guardian',
		'clomp',
		'corym skirmisher',
		'corym vanguard',
		'cow',
		'crawler',
		'crystal spider',
		'crystalcrusher',
		'cult believer',
		'cult enforcer',
		'cult scholar',
		'cursed ape',
		'cyclops drone',
		'cyclops smith',
		'dark faun',
		'death blob',
		'death priest',
		'deepling brawler',
		'deepling elite',
		'deepling guard',
		'deepling master librarian',
		'deepling scout',
		'deepling spellsinger',
		'deepling warrior',
		'demon parrot',
		'demon skeleton',
		'destroyer',
		'devourer',
		'diabolic imp',
		'diamond servant replica',
		'doom deer',
		'dragon hatchling',
		'dragon lord hatchling',
		'dragon lord',
		'dragon',
		'dragonling',
		'draken warmaster',
		'drillworm',
		'dwarf geomancer',
		'dwarf henchman',
		'earth elemental',
		'efreet',
		'elder bonelord',
		'elder forest fury',
		'elder mummy',
		'energy elemental',
		'enfeebled silencer',
		'enlightened of the cult',
		'enraged crystal golem',
		'enslaved dwarf',
		'eternal guardian',
		'evil sheep lord',
		'evil sheep',
		'execowtioner',
		'exotic bat',
		'exotic cave spider',
		'faun',
		'feversleep',
		'fire elemental',
		'flying book',
		'forest fury',
		'frost dragon hatchling',
		'frost dragon',
		'frost flower asura',
		'furious fire elemental',
		'ghoulish hyaena',
		'giant spider',
		'glooth anemone',
		'glooth bandit',
		'glooth blob',
		'glooth brigand',
		'glooth golem',
		'golden servant replica',
		'goldhanded cultist bride',
		'goldhanded cultist',
		'grave guard',
		'gravedigger',
		'green djinn',
		'gryphon',
		'haunted treeling',
		'hawk hopper',
		'hellspawn',
		'hero',
		'hibernal moth',
		'high voltage elemental',
		'honey elemental',
		'hot dog',
		'hydra',
		'ice dragon',
		'ice golem',
		'ice witch',
		'iks aucar',
		'iks chuka',
		'iks churrascan',
		'iks pututu',
		'infernal frog',
		'ink splash',
		'insectoid worker',
		'instable breach brood',
		'instable sparkion',
		'iron servant replica',
		'jungle moa',
		'killer caiman',
		'kollos',
		'lacewing moth',
		'lancer beetle',
		'lich',
		'lizard chosen',
		'lizard dragon priest',
		'lizard high guard',
		'lizard legionnaire',
		'lizard magistratus',
		'lizard snakecharmer',
		'lizard zaogun',
		'loricate orger',
		'lost basher',
		'lost exile',
		'lost husher',
		'lost soul',
		'lost thrower',
		'lumbering carnivor',
		'manta ray',
		'marid',
		'massive earth elemental',
		'massive energy elemental',
		'massive fire elemental',
		'massive water elemental',
		'metal gargoyle',
		'midnight asura',
		'minotaur cult follower',
		'minotaur cult prophet',
		'minotaur cult zealot',
		'minotaur hunter',
		'minotaur invader',
		'misguided bully',
		'misguided thief',
		'mooh\'tah warrior',
		'moohtant',
		'mutated bat',
		'mutated human',
		'mutated rat',
		'mutated tiger',
		'necromancer',
		'nightmare scion',
		'nightmare',
		'nightstalker',
		'noble lion',
		'nymph',
		'ogre brute',
		'ogre savage',
		'ogre shaman',
		'omnivora',
		'orc berserker',
		'orc cult fanatic',
		'orc cult inquisitor',
		'orc cult minion',
		'orc cult priest',
		'orc cultist',
		'orc leader',
		'orc marauder',
		'orc warlord',
		'orclops doomhauler',
		'orclops ravager',
		'orger',
		'parder',
		'percht',
		'pirat bombardier',
		'pirat cutthroat',
		'pirat mate',
		'pirat scoundrel',
		'pirate buccaneer',
		'pirate corsair',
		'pirate cutthroat',
		'pixie',
		'plaguesmith',
		'pooka',
		'priestess',
		'putrid mummy',
		'quara constrictor scout',
		'quara constrictor',
		'quara hydromancer scout',
		'quara hydromancer',
		'quara mantassin',
		'quara pincher scout',
		'quara pincher',
		'quara predator scout',
		'quara predator',
		'ravenous lava lurker',
		'renegade knight',
		'renegade quara constrictor',
		'renegade quara hydromancer',
		'renegade quara mantassin',
		'renegade quara pincher',
		'renegade quara predator',
		'roaring lion',
		'roast pork',
		'rot elemental',
		'rustheap golem',
		'sacred spider',
		'sandstone scorpion',
		'schiach',
		'sea serpent',
		'serpent spawn',
		'shaburak demon',
		'shaburak lord',
		'shaburak prince',
		'shadow pupil',
		'shaper matriarch',
		'shark',
		'silencer',
		'souleater',
		'spectre',
		'spidris elite',
		'spidris',
		'spitter',
		'stabilizing dread intruder',
		'stabilizing reality reaver',
		'stampor',
		'stone rhino',
		'stonerefiner',
		'swan maiden',
		'swarmer',
		'tomb servant',
		'troll legionnaire',
		'twisted pooka',
		'twisted shaper',
		'undead gladiator',
		'vampire bride',
		'vampire pig',
		'vampire viscount',
		'vampire',
		'vicious squire',
		'vile grandmaster',
		'wailing widow',
		'walker',
		'war golem',
		'warlock',
		'waspoid',
		'water elemental',
		'weakened frazzlemaw',
		'werebadger',
		'werebear',
		'wereboar',
		'werefox',
		'werehyaena shaman',
		'werehyaena',
		'werewolf',
		'wiggler',
		'wilting leaf golem',
		'worker golem',
		'worm priestess',
		'wyrm',
		'wyvern',
		'yielothax',
		'young sea serpent',
		'zombie',
	])],

	// https://tibiadraptor.com/bestiary?kills=2500&sortBy=name
	['hard-bestiary-creature', new Set([
		'adult goanna',
		'afflicted strider',
		'animated feather',
		'arachnophobica',
		'armadile',
		'bashmu',
		'biting book',
		'black sphinx acolyte',
		'blemished spawn',
		'blightwalker',
		'bluebeak',
		'boar man',
		'brain squid',
		'bramble wyrmling',
		'breach brood',
		'brinebrute inferniarch',
		'broodrider inferniarch',
		'bulltaur alchemist',
		'bulltaur brute',
		'bulltaur forgepriest',
		'burning book',
		'burning gladiator',
		'burster spectre',
		'candy floss elemental',
		'candy horror',
		'carnivostrich',
		'cave chimera',
		'cave devourer',
		'chasm spawn',
		'choking fear',
		'cinder wyrmling',
		'cliff strider',
		'cobra assassin',
		'cobra scout',
		'cobra vizier',
		'crape man',
		'crazed summer rearguard',
		'crazed summer vanguard',
		'crazed winter rearguard',
		'crazed winter vanguard',
		'crusader',
		'crypt warden',
		'crypt warrior',
		'cunning werepanther',
		'cursed book',
		'cursed prospector',
		'dark carnisylvan',
		'dark torturer',
		'dawnfire asura',
		'deathling scout',
		'deathling spellsinger',
		'deepling tyrant',
		'deepworm',
		'defiler',
		'demon outcast',
		'demon',
		'diremaw',
		'dragolisk',
		'draken abomination',
		'draken elite',
		'draken spellweaver',
		'dread intruder',
		'dworc shadowstalker',
		'elder wyrm',
		'energetic book',
		'energuardian of tales',
		'evil prospector',
		'eyeless devourer',
		'falcon knight',
		'falcon paladin',
		'feral sphinx',
		'feral werecrocodile',
		'flimsy lost soul',
		'floating savant',
		'foam stalker',
		'frazzlemaw',
		'freakish lost soul',
		'fury',
		'gazer spectre',
		'ghastly dragon',
		'girtablilu warrior',
		'gloom maw',
		'goggle cake',
		'gorger inferniarch',
		'grim reaper',
		'grimeleech',
		'guardian of tales',
		'guzzlemaw',
		'hand of cursed fate',
		'harpy',
		'haunted dragon',
		'headwalker',
		'hellfire fighter',
		'hellflayer',
		'hellhound',
		'hellhunter inferniarch',
		'hideous fungus',
		'hive overseer',
		'hulking carnisylvan',
		'humongous fungus',
		'icecold book',
		'iks yapunac',
		'infected weeper',
		'infernalist',
		'ink blob',
		'insane siren',
		'ironblight',
		'juggernaut',
		'juvenile bashmu',
		'knowledge elemental',
		'lamassu',
		'lava golem',
		'lava lurker',
		'lavafungus',
		'lavaworm',
		'liodile',
		'lion hydra',
		'lizard noble',
		'lost berserker',
		'magma crawler',
		'makara',
		'manticore',
		'mean lost soul',
		'medusa',
		'mega dragon',
		'menacing carnivor',
		'minotaur amazon',
		'mitmah scout',
		'mitmah seer',
		'naga archer',
		'naga warrior',
		'nibblemaw',
		'norcferatu heartless',
		'norcferatu nightweaver',
		'ogre rowdy',
		'ogre ruffian',
		'ogre sage',
		'orclops bloodbreaker',
		'orewalker',
		'phantasm',
		'poisonous carnisylvan',
		'priestess of the wild sun',
		'quara looter',
		'quara plunderer',
		'quara raider',
		'rage squid',
		'reality reaver',
		'retching horror',
		'rhindeer',
		'ripper spectre',
		'rootthing amber shaper',
		'rootthing bug tracker',
		'rootthing nutshell',
		'seacrest serpent',
		'shell drake',
		'shock head',
		'sight of surrender',
		'sineater inferniarch',
		'skeleton elite warrior',
		'son of Verminor',
		'soul-broken harbinger',
		'sparkion',
		'spellreaper inferniarch',
		'sphinx',
		'spiky carnivor',
		'squid warden',
		'stone devourer',
		'streaked devourer',
		'terrorsleep',
		'thanatursus',
		'tremendous tyrant',
		'true dawnfire asura',
		'true frost flower asura',
		'true midnight asura',
		'tunnel tyrant',
		'two-headed turtle',
		'undead dragon',
		'undead elite gladiator',
		'usurper archer',
		'usurper knight',
		'usurper warlock',
		'varg',
		'varnished diremaw',
		'venerable girtablilu',
		'vexclaw',
		'vulcongra',
		'wardragon',
		'weeper',
		'werecrocodile',
		'werelion',
		'werelioness',
		'werepanther',
		'weretiger',
		'white lion',
		'white weretiger',
		'young goanna',
	])],

	// https://tibiadraptor.com/bestiary?kills=5000&sortBy=name
	['challenging-bestiary-creature', new Set([
		'bloated man-maggot',
		'bony sea devil',
		'brachiodemon',
		'branchy crawler',
		'capricious phantom',
		'cloak of terror',
		'converter',
		'courage leech',
		'darklight construct',
		'darklight emitter',
		'darklight matter',
		'darklight source',
		'darklight striker',
		'distorted phantom',
		'druid\'s apparition',
		'emerald tortoise',
		'gore horn',
		'gorerilla',
		'headpecker',
		'hulking prehemoth',
		'infernal demon',
		'infernal phantom',
		'knight\'s apparition',
		'mantosaurus',
		'many faces',
		'meandering mushroom',
		'mercurial menace',
		'mould phantom',
		'mycobiontic beetle',
		'nighthunter',
		'noxious ripptor',
		'oozing carcass',
		'oozing corpus',
		'paladin\'s apparition',
		'rotten golem',
		'rotten man-maggot',
		'sabretooth',
		'shrieking cry-stal',
		'sopping carcass',
		'sopping corpus',
		'sorcerer\'s apparition',
		'stalking stalk',
		'sulphider',
		'sulphur spouter',
		'turbulent elemental',
		'undertaker',
		'vibrant phantom',
		'walking pillar',
		'wandering pillar',
	])],

	['lightbearer-creature', new Set([
		'acolyte of darkness',
		'bane of light',
		'bride of night',
		'doomsday cultist',
		'duskbringer',
		'herald of gloom',
		'midnight spawn',
		'midnight warrior',
		'nightslayer',
		'shadow hound',
	])],

	['azzilon-creature', new Set([
		'brinebrute inferniarch',
		'broodrider inferniarch',
		'gorger inferniarch',
		'hellhunter inferniarch',
		'sineater inferniarch',
		'spellreaper inferniarch',
	])],

	// TODO: https://github.com/tibiamaps/tibia-kill-stats/issues/1

]);

// All Bestiary creatures.
CREATURES_PER_CATEGORY.set(
	'bestiary-creature',
	new Set([
		...CREATURES_PER_CATEGORY.get('harmless-bestiary-creature'),
		...CREATURES_PER_CATEGORY.get('trivial-bestiary-creature'),
		...CREATURES_PER_CATEGORY.get('easy-bestiary-creature'),
		...CREATURES_PER_CATEGORY.get('medium-bestiary-creature'),
		...CREATURES_PER_CATEGORY.get('hard-bestiary-creature'),
		...CREATURES_PER_CATEGORY.get('challenging-bestiary-creature'),
	]),
);

const killsPerCategory = createKillsPerCategoryMap(CREATURES_PER_CATEGORY);

for (const [slug, killsPerCreature] of killsPerCategory) {
	await writeMap(killsPerCreature, `creatures/${slug}`);
}
