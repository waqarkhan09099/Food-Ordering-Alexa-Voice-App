exports.hello = ['welcome to Wikitech weather assistant and food ordering voice app!'];

exports.launch = ['Welcome to wiki Restaurant, <break time="300ms" /> I am your virtual assistant. <s>you can ask for the menu.</s> ', 'Welcome to wiki Restaurant, I am your virtual assistant. you can ask for the menu. '];

exports.menuCategory = ["Our menu category <break time='200ms' /> Fast Food, Rise Corner, Pakistani Bread, Fish , Pasta and Drinks, please ask any one menu category.", '1. Fast Food \n2. Rice Corner \n3. Pakistani Bread \n4. Fish \n5.Vegetable \n6. Pasta \n7. Drinks']

exports.fastFoodMenu = ['Our fast food menu have <break time="200ms" /> Seekh Kabab, Gola Kabab, Reshmi Kabab, Chicken Tikka, Zinger Burgur, Zinger, Fries and Nehari. ', '1. Seekh kabab \n2. Gola kabab \n3. Reshmi kabab \n4. Chicken Tikka \n5. Zinger Burgur \n6.Zinger \n7. Fries \n8. Nehari']

exports.riceMenu = ['Our rice corner menu have <break time="200ms" /> Beef biryani, Chicken Biryani, Special fried rice, Egg fried Rice, vegetable fried rice..', '1. Beef biryani \n2. Chicken Biryani \n3. Special fried rice \n4. Egg fried Rice \n5. vegetable fried rice']

exports.pakistaniBreadMenu = ['Our pakistani bread menu have <break time="200ms" /> Cheese Naan, Qeema Naan, Alu Paratha, Roghani Naan, Garlic Naan, Sada Naan and Sada Roti.', '1. Cheese Naan \n2. Qeema Naan \n3. Alu Paratha \n4. Roghani Naan \n5. Garlic Naan \n6. Sada Naan \n7. Sada Roti']

exports.fishMenu = ['Our fish corner menu have <break time="200ms" /> Joha Fish, Fish Chilli Dry and Grill Fish.', '1. Joha Fish \n2. Fish Chilli Dry \n3. Grill Fish']

exports.pastaMenu = ['Our pasta menu have <break time="200ms" /> Penne Alfredo Pasta, Penne Arrabiata pasta  and Grill Chicken Pasta.', '1. Penne Alfredo Pasta \n2. Penne Arrabiata pasta \n3. Grill Chicken Pasta']

exports.drinksMenu = ['Our drinks menu have <break time="200ms" /> Fruits Juice, tea, coffee, black coffee, Chineese Soup and soft drinks', '1. Fruits Juice \n2. Tea \n3. Coffee \n4. Black Coffee \n5. Chineese Soup \n6. Soft Drinks']

exports.foodSlotMissing = ['please tell me your dishes,<break time="200ms" /> feel free to ask about menu.', 'you can not tell any dishe, please tell me your selective dish.']

exports.drinkSlotMissing = ['please tell me your drink,<break time="200ms" /> feel free to ask about menu.', 'you can not tell any drink, please tell me your selective drink.']

exports.clientInfo = [`looks like you dont have an email associated with this device, please set your email in Alexa App Settings`, `looks like you dont have an name associated with this device, please set your name in Alexa App Settings`]

// exports.ordering = [
//     `your selection is ${quantity} ${foods},<break time="150ms" /> for confirm your order <break time="150ms" /> say, order confirm.`,
//     `your selection is ${quantity} ${foods}, for confirm your order say, Order confirm.`,
//     `your selection is ${quantity} ${drinks},<break time="150ms" /> for confirm the order <break time="150ms" /> say, order confirm.`,
//     `your selection is ${quantity} ${drinks}, for confirm the order say, Order confirm.`,
//     `your selection is ${quantity} ${drinks} and ${quantity} ${food} ,<break time="150ms" /> for confirm the order <break time="150ms" /> say, order confirm.</s>`,
//     `your selection is ${quantity} ${drinks} and ${quantity} ${food}, for confirm the order say, order confirm.`,
// ]