export type WishCategory = 'funny' | 'heartwarming' | 'flirt' | 'friendship' | 'diwali_special' | 'custom' | string;

export interface WishItem {
  id: string;
  category: WishCategory;
  hindi: string;
  english?: string;
  tag: string;
  emoji: string;
  imageUrl?: string;
}

export const WISHES_DATA: WishItem[] = [
  // ==========================================
  // CATEGORY A: FUNNY SHAYARI (हँसी-मज़ाक शायरी)
  // ==========================================
  {
    id: 'funny-1',
    category: 'funny',
    hindi: 'Diwali par mithai khoob khaana,\nKhushiyon ke saath selfie bhi banana,\nBas ek baat yaad rakhna,\nCalories ka hisaab kal lagana!',
    english: 'Eat as much mithai as your heart desires. Calorie counting starts tomorrow!',
    tag: 'Mithai & Calories',
    emoji: '🍬',
  },
  {
    id: 'funny-2',
    category: 'funny',
    hindi: 'Soan Papdi ka dabba ghoom-ghoom ke wapas na aa jaye,\nIs darr se humne chupke se use pehle hi kha liya!',
    english: 'Ate the Soan Papdi before it could be re-gifted right back to us!',
    tag: 'Soan Papdi Trap',
    emoji: '📦',
  },
  {
    id: 'funny-3',
    category: 'funny',
    hindi: 'Ghar ki safai mein kamar toot gayi aadhi,\nPhir bhi mummy boli—"Pankha toh saaf kiya hi nahi abhi!"\nShubh Deepavali!',
    english: 'Cleaned the whole house, but Mom still found that one dusty ceiling fan!',
    tag: 'Diwali Ki Safai',
    emoji: '🧹',
  },
  {
    id: 'funny-4',
    category: 'funny',
    hindi: 'Diwali ka plan bada simple hai boss:\nSubah mithai, dopahar ko sonaa,\nShaam ko saj-dhaj ke 50 photos lena,\nAur raat ko phir se kaju katli churaana!',
    english: 'Eat sweets, take a nap, click 50 photos, and raid the fridge for Kaju Katli at midnight.',
    tag: 'Perfect Schedule',
    emoji: '📸',
  },
  {
    id: 'funny-5',
    category: 'funny',
    hindi: 'Dost wo jo anaar jalaye toh khud pehle bhaag jaye,\nAur phooljhadi pakda kar bol de—\n"Arrey kuch nahi hota, bas pakad ke rakh!"\nHappy Diwali!',
    english: 'True friends run away after lighting the cracker, leaving you holding the sparkler!',
    tag: 'Friendship Goals',
    emoji: '✨',
  },
  {
    id: 'funny-6',
    category: 'funny',
    hindi: 'Kaju Katli ka dabba khola toh khali nikla,\nSamajh gaye ghar mein kisi shaitan bhai-behan ka chakkar hai!\nHanste rahiye, Happy Diwali!',
    english: 'Opened the Kaju Katli box only to find crumbs. Sibling crime detected!',
    tag: 'Sibling Secrets',
    emoji: '🍫',
  },
  {
    id: 'funny-7',
    category: 'funny',
    hindi: 'Diye toh jalenge poori raat shaan se,\nBas koi Soan Papdi na bhej de bholepan se!\nBaaki sab mangalmay ho!',
    english: 'May lamps burn bright all night, and may no one gift you Soan Papdi by mistake!',
    tag: 'Festive Humor',
    emoji: '🪔',
  },
  {
    id: 'funny-8',
    category: 'funny',
    hindi: 'Safai karte karte bachpan ke wo khilone mil gaye,\nJo das saal pehle "kho gaye the" keh kar mummy ne chhupa diye the!',
    english: 'Found childhood toys during Diwali cleaning that mom swore were lost 10 years ago!',
    tag: 'Nostalgic Cleaning',
    emoji: '🧸',
  },
  {
    id: 'funny-9',
    category: 'funny',
    hindi: 'Mithai khaane mein koi sharm nahi,\nDiwali saal mein ek hi baar aati hai,\nDiet chart ko bolo thoda intezaar kare!',
    english: 'No regrets on sweets—Diwali comes once a year, the diet chart can wait!',
    tag: 'Zero Regrets',
    emoji: '😋',
  },

  // ==========================================
  // CATEGORY B: HEARTWARMING WISHES (दिल से शुभकामनाएं)
  // ==========================================
  {
    id: 'heart-1',
    category: 'heartwarming',
    hindi: 'May your life always be filled with happiness, warmth and beautiful little moments. Keep smiling and shining.',
    english: 'आपकी जिंदगी सदा खुशियों, सुकून और अनगिनत छोटी-छोटी प्यारी यादों से महकती रहे।',
    tag: 'Little Moments',
    emoji: '🌸',
  },
  {
    id: 'heart-2',
    category: 'heartwarming',
    hindi: 'दीपक की मद्धम लौ से सजे आपका आँगन,\nखुशियों की पावन सुगंध से महके हर एक कण।\nआपको और आपके परिवार को दीपावली की असीम शुभकामनाएं।',
    english: 'May the gentle flame of earthen lamps grace your courtyard and fill every moment with harmony.',
    tag: 'Sacred Hearth',
    emoji: '🪔',
  },
  {
    id: 'heart-3',
    category: 'heartwarming',
    hindi: 'May this Diwali mark the beginning of peaceful mornings, restful nights, and a year where all your quiet prayers find their answers.',
    english: 'ईश्वर करे यह पर्व आपके जीवन में नई उम्मीदें और दिल को सुकून देने वाली शांति लेकर आए।',
    tag: 'New Beginnings',
    emoji: '🕊️',
  },
  {
    id: 'heart-4',
    category: 'heartwarming',
    hindi: 'जगमगाते दीपों की यह कतार आपके जीवन से हर उदासी को दूर करे,\nऔर आपके दिल में हमेशा अपनों के सच्चे प्यार का उजाला रहे।',
    english: 'May the rows of glowing diyas dissolve every sorrow and keep the warmth of true loved ones alive in your heart.',
    tag: 'Eternal Light',
    emoji: '✨',
  },
  {
    id: 'heart-5',
    category: 'heartwarming',
    hindi: 'The fragrance of mango-leaf torans, the sweetness of homemade mithai, and laughter with loved ones—may your home be filled with timeless togetherness.',
    english: 'घर की चौखट, मीठी बातें और अपनों की मुस्कान—यही इस पावन पर्व का सच्चा आशीर्वाद है।',
    tag: 'Family & Togetherness',
    emoji: '🏡',
  },
  {
    id: 'heart-6',
    category: 'heartwarming',
    hindi: 'खट्टी-मीठी यादें, सच्ची दोस्ती और चौखट पर जलता हुआ एक छोटा सा दीया—यही जिंदगी की सबसे अनमोल दौलत है। शुभ दीपावली!',
    english: 'Cherished memories, true friendship, and a humble diya at the door—the greatest treasures of life.',
    tag: 'True Friendship',
    emoji: '💛',
  },
  {
    id: 'heart-7',
    category: 'heartwarming',
    hindi: 'Here is to laughter that warms the soul, conversations that linger, and a festival that leaves you with a heart full of gratitude.',
    english: 'दिलों को सुकून देने वाली हँसी और अपनों के साथ का यह खूबसूरत त्योहार आपके लिए यादगार बने।',
    tag: 'Gratitude & Smiles',
    emoji: '☀️',
  },
  {
    id: 'heart-8',
    category: 'heartwarming',
    hindi: 'ईश्वर करे कि इस पावन पर्व पर आपका हर सपना एक नया सवेरा पाए,\nऔर आपकी मुस्कान सदा चाँद की तरह खिलती रहे। शुभ दीपावली!',
    english: 'May every quiet dream find its dawn, and may your smile remain as gentle and radiant as the moonlight.',
    tag: 'Gentle Grace',
    emoji: '🌙',
  },
  {
    id: 'heart-9',
    category: 'heartwarming',
    hindi: 'May the gentle glow of clay lamps illuminate the kindness within you and bring countless reasons to celebrate every single day.',
    english: 'माटी के दीयों की रोशनी आपके भीतर की अच्छाई को और निखारे, और हर दिन को उत्सव बना दे।',
    tag: 'Inner Kindness',
    emoji: '🌿',
  },

  // ==========================================
  // CATEGORY C: SUBTLE FLIRTING (हल्की-सी शरारत / A Little Flirt)
  // ==========================================
  {
    id: 'flirt-1',
    category: 'flirt',
    hindi: 'Diye toh har ghar mein jalte hain,\nPar kuch log apni smile se hi poori mehfil roshan kar dete hain.',
    english: 'Lamps light up homes, but some people illuminate the entire room just with their smile.',
    tag: 'Smile Light',
    emoji: '💫',
  },
  {
    id: 'flirt-2',
    category: 'flirt',
    hindi: 'Diwali par poora shahar roshan hai,\nLekin sach kahein toh aapki hassi ke aage sabhi lightein thodi pheeki lagti hain!',
    english: 'The whole city is lit up for Diwali, but honestly, every light feels subtle next to your laugh.',
    tag: 'City Glow',
    emoji: '✨',
  },
  {
    id: 'flirt-3',
    category: 'flirt',
    hindi: 'Rangoli toh bahut dekhi aaj,\nPar aapki aankhon se zyada khoobsurat design kahin nahi dikha!',
    english: 'Saw many intricate rangolis today, but none quite as captivating as your eyes.',
    tag: 'Rangoli Eyes',
    emoji: '🎨',
  },
  {
    id: 'flirt-4',
    category: 'flirt',
    hindi: 'Sab log mithai dhoondh rahe hain,\nUnhe kya pata sabse meethi cheez toh aapki baatein hain!',
    english: 'Everyone is busy hunting for sweets, not realizing your conversations are the sweetest part.',
    tag: 'Sweetest Talk',
    emoji: '🍯',
  },
  {
    id: 'flirt-5',
    category: 'flirt',
    hindi: 'Is Diwali ek wish maangi hai—\nKi aap jab bhi traditional outfit mein photo post karo, toh thoda advance notice diya karo... dil sambhalna aasan ho jaye!',
    english: 'A small request this Diwali: give a little heads-up before sharing traditional outfit photos, so we can prepare!',
    tag: 'Traditional Charm',
    emoji: '👘',
  },
  {
    id: 'flirt-6',
    category: 'flirt',
    hindi: 'Patakhe shor machaate hain bina baat ke,\nAur aapki ek halki si nazar chupchap dil chura le jaati hai bina kisi aawaaz ke!',
    english: 'Firecrackers make so much noise, while your subtle gaze effortlessly steals hearts in complete silence.',
    tag: 'Quiet Thief',
    emoji: '🎇',
  },
  {
    id: 'flirt-7',
    category: 'flirt',
    hindi: 'Diwali ke deepak toh bas ek bahaana hain,\nAsal mein toh aapki ek jhalak hi humara poora din roshan kar deti hai.',
    english: 'Diwali lamps are just an occasion—in truth, a single glimpse of you brightens the entire day.',
    tag: 'Day Brightener',
    emoji: '🕯️',
  },
  {
    id: 'flirt-8',
    category: 'flirt',
    hindi: 'Kaju Katli sabki favourite hoti hai,\nPar lagta hai usne bhi apni sweetness aapse hi borrow ki hai!',
    english: 'Everyone loves Kaju Katli, but we suspect it borrowed all its sweetness from you.',
    tag: 'Kaju Katli Vibe',
    emoji: '🍬',
  },
  {
    id: 'flirt-9',
    category: 'flirt',
    hindi: 'Log kehte hain roshni ka festival hai...\nPar hume lagta hai sabse zyada natural glow aapke chehre par rehta hai!',
    english: 'People call it the festival of lights, but we think the most natural glow belongs right on your face.',
    tag: 'Natural Glow',
    emoji: '🌟',
  },
];
