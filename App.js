import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, StatusBar, SafeAreaView, Modal, Alert } from 'react-native';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showPromo, setShowPromo] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderHistory, setOrderHistory] = useState([
    { id: 1001, date: '2024-01-15', items: ['Margherita Pizza', 'Garlic Bread'], total: 18.98, status: 'Delivered', restaurant: 'Pizza Palace' },
    { id: 1002, date: '2024-01-10', items: ['California Roll', 'Miso Soup'], total: 16.98, status: 'Delivered', restaurant: 'Sushi Express' },
  ]);
  const [selectedAddr, setSelectedAddr] = useState({ id: 1, label: 'Home', address: '123 Main Street, London, UK' });
  const user = { name: 'John Doe', email: 'john@example.com', phone: '+44 7700 900000', points: 1250 };
  const addresses = [
    { id: 1, label: 'Home', address: '123 Main Street, London, UK' },
    { id: 2, label: 'Work', address: '456 Office Park, London, UK' },
  ];
  const cuisines = ['All', 'Italian', 'Japanese', 'American', 'Mexican', 'Indian', 'Chinese', 'Thai'];
  const restaurants = [
    { id: 1, name: 'Pizza Palace', cuisine: 'Italian', rating: 4.5, time: '20-30 min', fee: 2.99, min: 10, icon: '\uD83C\uDF55', reviews: 234, desc: 'Authentic Italian pizzas' },
    { id: 2, name: 'Sushi Express', cuisine: 'Japanese', rating: 4.7, time: '25-35 min', fee: 3.49, min: 15, icon: '\uD83C\uDF63', reviews: 189, desc: 'Fresh sushi delivered fast' },
    { id: 3, name: 'Burger Barn', cuisine: 'American', rating: 4.3, time: '15-25 min', fee: 1.99, min: 8, icon: '\uD83C\uDF54', reviews: 456, desc: 'Classic American burgers' },
    { id: 4, name: 'Taco Town', cuisine: 'Mexican', rating: 4.6, time: '20-30 min', fee: 2.49, min: 12, icon: '\uD83C\uDF2E', reviews: 312, desc: 'Authentic Mexican street food' },
    { id: 5, name: 'Curry House', cuisine: 'Indian', rating: 4.8, time: '30-40 min', fee: 2.99, min: 15, icon: '\uD83C\uDF5B', reviews: 523, desc: 'Traditional Indian cuisine' },
    { id: 6, name: 'Dragon Wok', cuisine: 'Chinese', rating: 4.4, time: '25-35 min', fee: 2.49, min: 12, icon: '\uD83E\uDD61', reviews: 267, desc: 'Authentic Chinese flavors' },
    { id: 7, name: 'Thai Orchid', cuisine: 'Thai', rating: 4.6, time: '30-40 min', fee: 3.29, min: 14, icon: '\uD83C\uDF5C', reviews: 198, desc: 'Delicious Thai dishes' },
  ];
  const menuItems = [
    { id: 1, rid: 1, name: 'Margherita Pizza', price: 12.99, cat: 'Pizza', desc: 'Tomatoes, mozzarella, basil', cal: 850, pop: true },
    { id: 2, rid: 1, name: 'Pepperoni Pizza', price: 14.99, cat: 'Pizza', desc: 'Pepperoni with extra cheese', cal: 920, pop: true },
    { id: 3, rid: 1, name: 'Garlic Bread', price: 5.99, cat: 'Sides', desc: 'Crispy garlic bread', cal: 280, pop: false },
    { id: 4, rid: 1, name: 'Tiramisu', price: 7.99, cat: 'Desserts', desc: 'Classic Italian dessert', cal: 450, pop: true },
    { id: 5, rid: 2, name: 'California Roll', price: 10.99, cat: 'Sushi', desc: 'Crab, avocado, cucumber', cal: 320, pop: true },
    { id: 6, rid: 2, name: 'Salmon Nigiri', price: 8.99, cat: 'Sushi', desc: 'Fresh salmon on rice', cal: 180, pop: true },
    { id: 7, rid: 2, name: 'Miso Soup', price: 3.99, cat: 'Soup', desc: 'Traditional Japanese soup', cal: 120, pop: false },
    { id: 8, rid: 2, name: 'Edamame', price: 4.99, cat: 'Starters', desc: 'Steamed soybeans', cal: 150, pop: false },
    { id: 9, rid: 3, name: 'Cheeseburger', price: 9.99, cat: 'Burgers', desc: 'Classic with cheese', cal: 650, pop: true },
    { id: 10, rid: 3, name: 'Bacon Burger', price: 11.99, cat: 'Burgers', desc: 'Crispy bacon, cheese', cal: 780, pop: true },
    { id: 11, rid: 3, name: 'Fries', price: 3.99, cat: 'Sides', desc: 'Crispy golden fries', cal: 380, pop: true },
    { id: 12, rid: 3, name: 'Milkshake', price: 5.99, cat: 'Drinks', desc: 'Creamy vanilla shake', cal: 520, pop: false },
    { id: 13, rid: 4, name: 'Beef Taco', price: 4.99, cat: 'Tacos', desc: 'Seasoned beef, lettuce', cal: 220, pop: true },
    { id: 14, rid: 4, name: 'Burrito Bowl', price: 11.99, cat: 'Bowls', desc: 'Rice, beans, toppings', cal: 680, pop: true },
    { id: 15, rid: 4, name: 'Nachos Grande', price: 9.99, cat: 'Starters', desc: 'Loaded nachos', cal: 890, pop: true },
    { id: 16, rid: 5, name: 'Butter Chicken', price: 13.99, cat: 'Curry', desc: 'Creamy tomato curry', cal: 620, pop: true },
    { id: 17, rid: 5, name: 'Naan Bread', price: 2.99, cat: 'Bread', desc: 'Soft Indian flatbread', cal: 180, pop: false },
    { id: 18, rid: 5, name: 'Samosa', price: 5.99, cat: 'Starters', desc: 'Crispy spiced pastry', cal: 280, pop: true },
    { id: 19, rid: 6, name: 'Kung Pao Chicken', price: 12.99, cat: 'Main', desc: 'Spicy chicken, peanuts', cal: 580, pop: true },
    { id: 20, rid: 6, name: 'Fried Rice', price: 8.99, cat: 'Rice', desc: 'Egg fried rice', cal: 420, pop: true },
    { id: 21, rid: 7, name: 'Pad Thai', price: 11.99, cat: 'Noodles', desc: 'Stir-fried noodles', cal: 550, pop: true },
    { id: 22, rid: 7, name: 'Green Curry', price: 13.99, cat: 'Curry', desc: 'Coconut curry, veg', cal: 480, pop: true },
  ];

  const addToCart = (item) => {
    const e = cart.find(c => c.id === item.id);
    if (e) setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
    else setCart([...cart, { ...item, qty: 1 }]);
  };
  const removeFromCart = (id) => {
    const e = cart.find(c => c.id === id);
    if (e && e.qty > 1) setCart(cart.map(c => c.id === id ? { ...c, qty: c.qty - 1 } : c));
    else setCart(cart.filter(c => c.id !== id));
  };
  const toggleFav = (id) => favorites.includes(id) ? setFavorites(favorites.filter(f => f !== id)) : setFavorites([...favorites, id]);
  const subtotal = () => cart.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = () => selectedRestaurant ? selectedRestaurant.fee : 2.99;
  const total = () => Math.max(0, subtotal() + deliveryFee() - discount);
  const applyPromo = () => {
    const codes = { WELCOME20: { d: 20, t: 'p', m: 15 }, SAVE5: { d: 5, t: 'f', m: 20 }, FASTHUB10: { d: 10, t: 'p', m: 25 } };
    const p = codes[promoCode.toUpperCase()];
    if (p && subtotal() >= p.m) {
      setDiscount(p.t === 'p' ? (subtotal() * p.d) / 100 : p.d);
      setShowPromo(false);
      Alert.alert('Success', p.d + (p.t === 'p' ? '% off!' : ' pounds off!'));
    } else Alert.alert('Invalid', 'Code invalid or min order not met.');
  };
  const placeOrder = () => {
    const o = { id: Date.now(), date: new Date().toISOString().split('T')[0], items: cart.map(i => i.name), total: total(), status: 'Preparing', restaurant: selectedRestaurant?.name || 'FastHub', eta: '30-40 min', address: selectedAddr.address };
    setCurrentOrder(o); setOrderHistory([o, ...orderHistory]); setCart([]); setDiscount(0); setPromoCode(''); setScreen('tracking');
  };
  const filtered = restaurants.filter(r => (r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())) && (selectedCuisine === 'All' || r.cuisine === selectedCuisine));

  const HomeScreen = () => (
    <ScrollView style={s.container}>
      <View style={s.header}>
        <View style={s.headerTop}>
          <View>
            <Text style={s.greeting}>Hello, {user.name.split(' ')[0]}!</Text>
            <TouchableOpacity onPress={() => setScreen('addresses')}>
              <Text style={s.location}>\uD83D\uDCCD {selectedAddr.label}: {selectedAddr.address.substring(0, 25)}...</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => setScreen('profile')} style={s.avatar}>
            <Text style={s.avatarText}>{user.name.charAt(0)}</Text>
          </TouchableOpacity>
        </View>
        <TextInput style={s.searchBar} placeholder="Search restaurants or cuisines..." placeholderTextColor="#999" value={searchQuery} onChangeText={setSearchQuery} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chips}>
        {cuisines.map(c => (
          <TouchableOpacity key={c} style={[s.chip, selectedCuisine === c && s.chipActive]} onPress={() => setSelectedCuisine(c)}>
            <Text style={[s.chipText, selectedCuisine === c && s.chipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {favorites.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>\u2764\uFE0F Your Favorites</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {restaurants.filter(r => favorites.includes(r.id)).map(r => (
              <TouchableOpacity key={r.id} style={s.favCard} onPress={() => { setSelectedRestaurant(r); setScreen('menu'); }}>
                <Text style={{fontSize:32}}>{r.icon}</Text>
                <Text style={s.favName}>{r.name}</Text>
                <Text style={s.favRating}>\u2B50 {r.rating}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      <View style={s.section}>
        <Text style={s.sectionTitle}>\uD83C\uDF1F Popular Near You</Text>
        {filtered.map(r => (
          <TouchableOpacity key={r.id} style={s.card} onPress={() => { setSelectedRestaurant(r); setScreen('menu'); }}>
            <View style={s.cardLeft}><Text style={{fontSize:36}}>{r.icon}</Text></View>
            <View style={{flex:1}}>
              <View style={s.cardHeader}>
                <Text style={s.cardTitle}>{r.name}</Text>
                <TouchableOpacity onPress={() => toggleFav(r.id)}>
                  <Text style={{fontSize:20}}>{favorites.includes(r.id) ? '\u2764\uFE0F' : '\uD83E\uDD0D'}</Text>
                </TouchableOpacity>
              </View>
              <Text style={s.cardSub}>{r.cuisine} - {r.desc}</Text>
              <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:4}}>
                <Text style={s.rating}>\u2B50 {r.rating} ({r.reviews})</Text>
                <Text style={s.time}>\uD83D\uDE9A {r.time}</Text>
              </View>
              <Text style={s.fee}>\u00A3{r.fee.toFixed(2)} delivery | Min \u00A3{r.min}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const MenuScreen = () => {
    const items = menuItems.filter(i => i.rid === selectedRestaurant?.id);
    const cats = [...new Set(items.map(i => i.cat))];
    return (
      <ScrollView style={s.container}>
        <View style={{flexDirection:'row',justifyContent:'space-between',padding:15}}>
          <TouchableOpacity onPress={() => setScreen('home')}><Text style={s.back}>\u2190 Back</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => toggleFav(selectedRestaurant.id)}><Text style={{fontSize:24}}>{favorites.includes(selectedRestaurant?.id) ? '\u2764\uFE0F' : '\uD83E\uDD0D'}</Text></TouchableOpacity>
        </View>
        <View style={s.restInfo}>
          <Text style={{fontSize:48,textAlign:'center'}}>{selectedRestaurant?.icon}</Text>
          <Text style={s.restName}>{selectedRestaurant?.name}</Text>
          <Text style={s.restDesc}>{selectedRestaurant?.desc}</Text>
          <View style={{flexDirection:'row',justifyContent:'center',gap:15,marginTop:8}}>
            <Text style={s.meta}>\u2B50 {selectedRestaurant?.rating}</Text>
            <Text style={s.meta}>\uD83D\uDE9A {selectedRestaurant?.time}</Text>
            <Text style={s.meta}>\u00A3{selectedRestaurant?.fee} delivery</Text>
          </View>
        </View>
        {cats.map(cat => (
          <View key={cat} style={{paddingHorizontal:15,marginTop:15}}>
            <Text style={s.catTitle}>{cat}</Text>
            {items.filter(i => i.cat === cat).map(item => (
              <View key={item.id} style={s.menuItem}>
                <View style={{flex:1}}>
                  <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Text style={s.itemName}>{item.name}</Text>
                    {item.pop && <Text style={s.popBadge}>\uD83D\uDD25</Text>}
                  </View>
                  <Text style={s.itemDesc}>{item.desc}</Text>
                  <Text style={s.itemCal}>{item.cal} cal</Text>
                  <Text style={s.itemPrice}>\u00A3{item.price.toFixed(2)}</Text>
                </View>
                <TouchableOpacity style={s.addBtn} onPress={() => addToCart(item)}>
                  <Text style={s.addBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
        <View style={{height:100}} />
      </ScrollView>
    );
  };

  const CartScreen = () => (
    <ScrollView style={s.container}>
      <TouchableOpacity onPress={() => setScreen('home')} style={{padding:15}}><Text style={s.back}>\u2190 Back</Text></TouchableOpacity>
      <Text style={s.pageTitle}>\uD83D\uDED2 Your Cart</Text>
      {cart.length === 0 ? (
        <View style={s.empty}>
          <Text style={{fontSize:48}}>\uD83D\uDE22</Text>
          <Text style={s.emptyText}>Your cart is empty</Text>
          <TouchableOpacity style={s.browseBtn} onPress={() => setScreen('home')}><Text style={s.browseBtnText}>Browse Restaurants</Text></TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={s.deliverTo}>
            <Text style={s.deliverLabel}>\uD83D\uDCCD Deliver to:</Text>
            <TouchableOpacity onPress={() => setScreen('addresses')}>
              <Text style={{color:'#333',fontSize:14}}>{selectedAddr.address}</Text>
              <Text style={{color:'#00CCBC',fontSize:12,marginTop:2}}>Change</Text>
            </TouchableOpacity>
          </View>
          {cart.map(item => (
            <View key={item.id} style={s.cartItem}>
              <View style={{flex:1}}>
                <Text style={s.cartName}>{item.name}</Text>
                <Text style={s.cartPrice}>\u00A3{item.price.toFixed(2)}</Text>
              </View>
              <View style={s.qtyRow}>
                <TouchableOpacity style={s.qtyBtn} onPress={() => removeFromCart(item.id)}><Text style={s.qtyBtnText}>-</Text></TouchableOpacity>
                <Text style={s.qtyNum}>{item.qty}</Text>
                <TouchableOpacity style={s.qtyBtn} onPress={() => addToCart(item)}><Text style={s.qtyBtnText}>+</Text></TouchableOpacity>
              </View>
              <Text style={s.cartTotal}>\u00A3{(item.price * item.qty).toFixed(2)}</Text>
            </View>
          ))}
          <TouchableOpacity style={s.promoBtn} onPress={() => setShowPromo(true)}>
            <Text style={s.promoBtnText}>\uD83C\uDF81 {discount > 0 ? 'Discount: -\u00A3' + discount.toFixed(2) : 'Add Promo Code'}</Text>
          </TouchableOpacity>
          <View style={s.summary}>
            <View style={s.sumRow}><Text style={s.sumLabel}>Subtotal</Text><Text style={s.sumVal}>\u00A3{subtotal().toFixed(2)}</Text></View>
            <View style={s.sumRow}><Text style={s.sumLabel}>Delivery</Text><Text style={s.sumVal}>\u00A3{deliveryFee().toFixed(2)}</Text></View>
            {discount > 0 && <View style={s.sumRow}><Text style={s.sumLabel}>Discount</Text><Text style={{color:'#e74c3c',fontWeight:'600'}}>-\u00A3{discount.toFixed(2)}</Text></View>}
            <View style={[s.sumRow,{borderTopWidth:1,borderTopColor:'#eee',paddingTop:10,marginTop:5}]}>
              <Text style={s.totalLabel}>Total</Text><Text style={s.totalVal}>\u00A3{total().toFixed(2)}</Text>
            </View>
          </View>
          <TouchableOpacity style={s.checkoutBtn} onPress={placeOrder}>
            <Text style={s.checkoutText}>Place Order - \u00A3{total().toFixed(2)}</Text>
          </TouchableOpacity>
        </>
      )}
      <Modal visible={showPromo} transparent animationType="slide">
        <View style={s.modalOv}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>\uD83C\uDF81 Enter Promo Code</Text>
            <TextInput style={s.promoInput} placeholder="Enter code..." value={promoCode} onChangeText={setPromoCode} autoCapitalize="characters" />
            <View style={{flexDirection:'row',gap:10,marginTop:15}}>
              <TouchableOpacity style={[s.modalBtn,{backgroundColor:'#eee'}]} onPress={() => setShowPromo(false)}><Text>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={[s.modalBtn,{backgroundColor:'#00CCBC'}]} onPress={applyPromo}><Text style={{color:'#fff'}}>Apply</Text></TouchableOpacity>
            </View>
            <Text style={{color:'#999',fontSize:12,marginTop:10}}>Try: WELCOME20, SAVE5, FASTHUB10</Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );

  const TrackingScreen = () => {
    const [step, setStep] = useState(0);
    const steps = ['Order Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
    useEffect(() => { const t = setInterval(() => setStep(p => p < 3 ? p + 1 : p), 5000); return () => clearInterval(t); }, []);
    return (
      <ScrollView style={s.container}>
        <View style={s.trackHead}>
          <Text style={s.trackTitle}>Order #{currentOrder?.id}</Text>
          <Text style={s.trackSub}>from {currentOrder?.restaurant}</Text>
        </View>
        <View style={s.trackProgress}>
          {steps.map((st, i) => (
            <View key={i} style={s.trackStep}>
              <View style={[s.dot, i <= step && s.dotActive]} />
              <Text style={[s.trackLabel, i <= step && s.trackLabelActive]}>{st}</Text>
              {i < 3 && <View style={[s.trackLine, i < step && s.trackLineActive]} />}
            </View>
          ))}
        </View>
        <View style={s.trackInfo}>
          <Text style={s.trackEta}>Est: {currentOrder?.eta}</Text>
          <Text style={s.trackAddr}>{currentOrder?.address}</Text>
        </View>
        <View style={s.orderDets}>
          <Text style={s.orderDetsTitle}>Order Details</Text>
          {currentOrder?.items.map((item, i) => <Text key={i} style={s.orderItem}>- {item}</Text>)}
          <Text style={s.orderTotal}>Total: \u00A3{currentOrder?.total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={s.homeBtn} onPress={() => { setCurrentOrder(null); setScreen('home'); }}>
          <Text style={s.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const OrdersScreen = () => (
    <ScrollView style={s.container}>
      <TouchableOpacity onPress={() => setScreen('profile')} style={{padding:15}}><Text style={s.back}>\u2190 Back</Text></TouchableOpacity>
      <Text style={s.pageTitle}>Order History</Text>
      {orderHistory.map(o => (
        <View key={o.id} style={s.histCard}>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <Text style={s.histRest}>{o.restaurant}</Text>
            <Text style={[s.histStatus, o.status === 'Delivered' ? {color:'#27ae60'} : {color:'#f39c12'}]}>{o.status}</Text>
          </View>
          <Text style={s.histDate}>{o.date}</Text>
          <Text style={s.histItems}>{o.items.join(', ')}</Text>
          <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:8}}>
            <Text style={s.histTotal}>\u00A3{o.total.toFixed(2)}</Text>
            <TouchableOpacity style={s.reorderBtn}><Text style={s.reorderText}>Reorder</Text></TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const ProfileScreen = () => (
    <ScrollView style={s.container}>
      <TouchableOpacity onPress={() => setScreen('home')} style={{padding:15}}><Text style={s.back}>\u2190 Back</Text></TouchableOpacity>
      <View style={s.profHead}>
        <View style={s.profAvatar}><Text style={s.profAvatarText}>{user.name.charAt(0)}</Text></View>
        <Text style={s.profName}>{user.name}</Text>
        <Text style={s.profEmail}>{user.email}</Text>
      </View>
      <View style={s.loyaltyCard}>
        <Text style={s.loyaltyTitle}>Loyalty Points</Text>
        <Text style={s.loyaltyPts}>{user.points}</Text>
        <Text style={{color:'#fff',fontSize:12}}>Points from orders</Text>
      </View>
      <View style={s.profMenu}>
        {[['Order History','orders'],['Saved Addresses','addresses'],['Payment Methods',null],['Notifications',null],['Help & Support',null],['Settings',null]].map(([label, nav], i) => (
          <TouchableOpacity key={i} style={s.profItem} onPress={() => nav && setScreen(nav)}>
            <Text style={s.profItemText}>{label}</Text>
            <Text style={s.profArrow}>></Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={s.logoutBtn}><Text style={s.logoutText}>Log Out</Text></TouchableOpacity>
    </ScrollView>
  );

  const AddressesScreen = () => (
    <ScrollView style={s.container}>
      <TouchableOpacity onPress={() => setScreen('home')} style={{padding:15}}><Text style={s.back}>\u2190 Back</Text></TouchableOpacity>
      <Text style={s.pageTitle}>Saved Addresses</Text>
      {addresses.map(a => (
        <TouchableOpacity key={a.id} style={[s.addrCard, selectedAddr.id === a.id && s.addrCardActive]} onPress={() => setSelectedAddr(a)}>
          <Text style={s.addrLabel}>{a.label}</Text>
          <Text style={s.addrText}>{a.address}</Text>
          {selectedAddr.id === a.id && <Text style={s.addrCheck}>\u2713</Text>}
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={s.addAddrBtn}><Text style={s.addAddrText}>+ Add New Address</Text></TouchableOpacity>
    </ScrollView>
  );

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" />
      {screen === 'home' && <HomeScreen />}
      {screen === 'menu' && <MenuScreen />}
      {screen === 'cart' && <CartScreen />}
      {screen === 'tracking' && <TrackingScreen />}
      {screen === 'orders' && <OrdersScreen />}
      {screen === 'profile' && <ProfileScreen />}
      {screen === 'addresses' && <AddressesScreen />}
      {screen !== 'tracking' && (
        <View style={s.nav}>
          <TouchableOpacity onPress={() => setScreen('home')} style={s.navBtn}>
            <Text style={s.navIcon}>\uD83C\uDFE0</Text>
            <Text style={[s.navText, screen === 'home' && s.navActive]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setScreen('orders')} style={s.navBtn}>
            <Text style={s.navIcon}>\uD83D\uDCDC</Text>
            <Text style={[s.navText, screen === 'orders' && s.navActive]}>Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setScreen('cart')} style={s.navBtn}>
            <Text style={s.navIcon}>\uD83D\uDED2</Text>
            {cart.length > 0 && <View style={s.badge}><Text style={s.badgeText}>{cart.reduce((a,b) => a+b.qty, 0)}</Text></View>}
            <Text style={[s.navText, screen === 'cart' && s.navActive]}>Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setScreen('profile')} style={s.navBtn}>
            <Text style={s.navIcon}>\uD83D\uDC64</Text>
            <Text style={[s.navText, screen === 'profile' && s.navActive]}>Profile</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:{flex:1,backgroundColor:'#fff'},
  container:{flex:1,backgroundColor:'#f5f5f5'},
  header:{backgroundColor:'#00CCBC',padding:20,paddingTop:10},
  headerTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:12},
  greeting:{fontSize:22,fontWeight:'bold',color:'#fff'},
  location:{fontSize:12,color:'#e0f7f5',marginTop:2},
  avatar:{width:40,height:40,borderRadius:20,backgroundColor:'#fff',justifyContent:'center',alignItems:'center'},
  avatarText:{fontSize:18,fontWeight:'bold',color:'#00CCBC'},
  searchBar:{backgroundColor:'#fff',padding:12,borderRadius:8,fontSize:16},
  chips:{paddingHorizontal:10,paddingVertical:10},
  chip:{paddingHorizontal:16,paddingVertical:8,borderRadius:20,backgroundColor:'#eee',marginHorizontal:4},
  chipActive:{backgroundColor:'#00CCBC'},
  chipText:{fontSize:14,color:'#666'},
  chipTextActive:{color:'#fff',fontWeight:'600'},
  section:{padding:15},
  sectionTitle:{fontSize:20,fontWeight:'bold',marginBottom:12,color:'#333'},
  favCard:{backgroundColor:'#fff',padding:15,borderRadius:10,marginRight:12,alignItems:'center',width:120,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.1,shadowRadius:4,elevation:3},
  favName:{fontSize:12,fontWeight:'600',marginTop:5,color:'#333'},
  favRating:{fontSize:11,color:'#666',marginTop:2},
  card:{flexDirection:'row',backgroundColor:'#fff',padding:12,borderRadius:10,marginBottom:10,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.1,shadowRadius:4,elevation:3},
  cardLeft:{width:60,height:60,borderRadius:30,backgroundColor:'#f0f0f0',justifyContent:'center',alignItems:'center',marginRight:12},
  cardHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  cardTitle:{fontSize:16,fontWeight:'600',color:'#333'},
  cardSub:{fontSize:12,color:'#888',marginTop:2},
  rating:{fontSize:13,color:'#666'},
  time:{fontSize:13,color:'#00CCBC'},
  fee:{fontSize:11,color:'#999',marginTop:4},
  back:{fontSize:16,color:'#00CCBC',fontWeight:'600'},
  restInfo:{alignItems:'center',padding:20,backgroundColor:'#fff',marginBottom:10},
  restName:{fontSize:22,fontWeight:'bold',color:'#333',marginTop:8},
  restDesc:{fontSize:14,color:'#888',marginTop:4},
  meta:{fontSize:13,color:'#666'},
  catTitle:{fontSize:18,fontWeight:'bold',color:'#333',marginBottom:10},
  menuItem:{flexDirection:'row',backgroundColor:'#fff',padding:12,borderRadius:8,marginBottom:8,alignItems:'center'},
  itemName:{fontSize:15,fontWeight:'600',color:'#333'},
  popBadge:{fontSize:12,marginLeft:6},
  itemDesc:{fontSize:12,color:'#888',marginTop:2},
  itemCal:{fontSize:11,color:'#bbb',marginTop:2},
  itemPrice:{fontSize:14,fontWeight:'700',color:'#00CCBC',marginTop:4},
  addBtn:{width:36,height:36,borderRadius:18,backgroundColor:'#00CCBC',justifyContent:'center',alignItems:'center'},
  addBtnText:{color:'#fff',fontSize:20,fontWeight:'bold'},
  pageTitle:{fontSize:22,fontWeight:'bold',paddingHorizontal:15,color:'#333',marginBottom:15},
  empty:{alignItems:'center',marginTop:60},
  emptyText:{fontSize:16,color:'#999',marginTop:10},
  browseBtn:{backgroundColor:'#00CCBC',paddingVertical:12,paddingHorizontal:25,borderRadius:8,marginTop:15},
  browseBtnText:{color:'#fff',fontWeight:'600'},
  deliverTo:{backgroundColor:'#fff',padding:15,marginHorizontal:15,borderRadius:8,marginBottom:10},
  deliverLabel:{fontSize:14,fontWeight:'600',color:'#333',marginBottom:4},
  cartItem:{flexDirection:'row',alignItems:'center',backgroundColor:'#fff',padding:12,marginHorizontal:15,borderRadius:8,marginBottom:8},
  cartName:{fontSize:15,fontWeight:'600',color:'#333'},
  cartPrice:{fontSize:12,color:'#888',marginTop:2},
  qtyRow:{flexDirection:'row',alignItems:'center',marginHorizontal:10},
  qtyBtn:{width:28,height:28,borderRadius:14,backgroundColor:'#eee',justifyContent:'center',alignItems:'center'},
  qtyBtnText:{fontSize:16,fontWeight:'bold',color:'#333'},
  qtyNum:{fontSize:16,fontWeight:'600',marginHorizontal:10},
  cartTotal:{fontSize:15,fontWeight:'700',color:'#00CCBC'},
  promoBtn:{backgroundColor:'#fff',padding:15,marginHorizontal:15,borderRadius:8,marginTop:5,borderWidth:1,borderColor:'#00CCBC',borderStyle:'dashed'},
  promoBtnText:{color:'#00CCBC',fontWeight:'600',textAlign:'center'},
  summary:{backgroundColor:'#fff',padding:15,marginHorizontal:15,borderRadius:8,marginTop:10},
  sumRow:{flexDirection:'row',justifyContent:'space-between',marginBottom:6},
  sumLabel:{fontSize:14,color:'#888'},
  sumVal:{fontSize:14,color:'#333'},
  totalLabel:{fontSize:18,fontWeight:'bold',color:'#333'},
  totalVal:{fontSize:20,fontWeight:'bold',color:'#00CCBC'},
  checkoutBtn:{backgroundColor:'#00CCBC',padding:16,marginHorizontal:15,borderRadius:8,alignItems:'center',marginTop:15,marginBottom:30},
  checkoutText:{color:'#fff',fontSize:17,fontWeight:'bold'},
  modalOv:{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',padding:30},
  modalBox:{backgroundColor:'#fff',borderRadius:12,padding:20,alignItems:'center'},
  modalTitle:{fontSize:18,fontWeight:'bold',marginBottom:15},
  promoInput:{borderWidth:1,borderColor:'#ddd',borderRadius:8,padding:12,width:'100%',fontSize:16},
  modalBtn:{flex:1,padding:12,borderRadius:8,alignItems:'center'},
  trackHead:{alignItems:'center',padding:20,backgroundColor:'#00CCBC'},
  trackTitle:{fontSize:20,fontWeight:'bold',color:'#fff'},
  trackSub:{fontSize:14,color:'#e0f7f5',marginTop:4},
  trackProgress:{padding:20},
  trackStep:{flexDirection:'row',alignItems:'center',marginBottom:20},
  dot:{width:20,height:20,borderRadius:10,backgroundColor:'#ddd',marginRight:10},
  dotActive:{backgroundColor:'#00CCBC'},
  trackLabel:{fontSize:14,color:'#999'},
  trackLabelActive:{color:'#333',fontWeight:'600'},
  trackLine:{position:'absolute',left:9,top:20,width:2,height:20,backgroundColor:'#ddd'},
  trackLineActive:{backgroundColor:'#00CCBC'},
  trackInfo:{padding:20,backgroundColor:'#fff',margin:15,borderRadius:8},
  trackEta:{fontSize:16,fontWeight:'600',color:'#333'},
  trackAddr:{fontSize:14,color:'#888',marginTop:4},
  orderDets:{padding:20,backgroundColor:'#fff',margin:15,borderRadius:8},
  orderDetsTitle:{fontSize:16,fontWeight:'bold',color:'#333',marginBottom:8},
  orderItem:{fontSize:14,color:'#666',marginBottom:4},
  orderTotal:{fontSize:16,fontWeight:'bold',color:'#00CCBC',marginTop:8},
  homeBtn:{backgroundColor:'#00CCBC',padding:16,margin:15,borderRadius:8,alignItems:'center'},
  homeBtnText:{color:'#fff',fontSize:16,fontWeight:'bold'},
  histCard:{backgroundColor:'#fff',padding:15,marginHorizontal:15,borderRadius:8,marginBottom:10},
  histRest:{fontSize:16,fontWeight:'600',color:'#333'},
  histStatus:{fontSize:13,fontWeight:'600'},
  histDate:{fontSize:12,color:'#999',marginTop:2},
  histItems:{fontSize:13,color:'#666',marginTop:4},
  histTotal:{fontSize:16,fontWeight:'bold',color:'#333'},
  reorderBtn:{backgroundColor:'#00CCBC',paddingVertical:6,paddingHorizontal:15,borderRadius:6},
  reorderText:{color:'#fff',fontWeight:'600',fontSize:13},
  profHead:{alignItems:'center',padding:20},
  profAvatar:{width:80,height:80,borderRadius:40,backgroundColor:'#00CCBC',justifyContent:'center',alignItems:'center'},
  profAvatarText:{fontSize:32,fontWeight:'bold',color:'#fff'},
  profName:{fontSize:22,fontWeight:'bold',color:'#333',marginTop:10},
  profEmail:{fontSize:14,color:'#888',marginTop:4},
  loyaltyCard:{backgroundColor:'#00CCBC',padding:20,margin:15,borderRadius:12,alignItems:'center'},
  loyaltyTitle:{fontSize:16,fontWeight:'600',color:'#fff'},
  loyaltyPts:{fontSize:36,fontWeight:'bold',color:'#fff'},
  profMenu:{backgroundColor:'#fff',margin:15,borderRadius:8},
  profItem:{flexDirection:'row',justifyContent:'space-between',padding:16,borderBottomWidth:1,borderBottomColor:'#f0f0f0'},
  profItemText:{fontSize:15,color:'#333'},
  profArrow:{fontSize:18,color:'#ccc'},
  logoutBtn:{margin:15,padding:16,borderRadius:8,borderWidth:1,borderColor:'#e74c3c',alignItems:'center'},
  logoutText:{color:'#e74c3c',fontSize:16,fontWeight:'600'},
  addrCard:{backgroundColor:'#fff',padding:15,marginHorizontal:15,borderRadius:8,marginBottom:10,borderWidth:2,borderColor:'transparent'},
  addrCardActive:{borderColor:'#00CCBC'},
  addrLabel:{fontSize:16,fontWeight:'600',color:'#333'},
  addrText:{fontSize:14,color:'#888',marginTop:4},
  addrCheck:{position:'absolute',top:15,right:15,fontSize:18,color:'#00CCBC',fontWeight:'bold'},
  addAddrBtn:{margin:15,padding:16,borderRadius:8,borderWidth:1,borderColor:'#00CCBC',borderStyle:'dashed',alignItems:'center'},
  addAddrText:{color:'#00CCBC',fontWeight:'600'},
  nav:{flexDirection:'row',backgroundColor:'#fff',borderTopWidth:1,borderTopColor:'#eee',paddingBottom:10},
  navBtn:{flex:1,alignItems:'center',paddingTop:10},
  navIcon:{fontSize:20},
  navText:{fontSize:11,color:'#999',marginTop:2},
  navActive:{color:'#00CCBC',fontWeight:'600'},
  badge:{position:'absolute',top:-5,right:-8,backgroundColor:'#e74c3c',borderRadius:9,width:18,height:18,justifyContent:'center',alignItems:'center'},
  badgeText:{color:'#fff',fontSize:10,fontWeight:'bold'},
});
