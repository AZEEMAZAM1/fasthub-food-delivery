import React, { useState, createContext, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList, StyleSheet, TextInput, Alert, Dimensions, StatusBar, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ============ CONTEXT ============
const CartContext = createContext();
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const addToCart = (item, restaurant) => {
    const existing = cart.find(c => c.id === item.id && c.restaurantId === restaurant.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id && c.restaurantId === restaurant.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...item, qty: 1, restaurantId: restaurant.id, restaurantName: restaurant.name }]);
    }
  };
  const removeFromCart = (itemId, restId) => {
    const existing = cart.find(c => c.id === itemId && c.restaurantId === restId);
    if (existing && existing.qty > 1) {
      setCart(cart.map(c => c.id === itemId && c.restaurantId === restId ? { ...c, qty: c.qty - 1 } : c));
    } else {
      setCart(cart.filter(c => !(c.id === itemId && c.restaurantId === restId)));
    }
  };
  const clearCart = () => setCart([]);
  const getTotal = () => cart.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2);
  const getCount = () => cart.reduce((sum, item) => sum + item.qty, 0);
  const placeOrder = () => {
    if (cart.length === 0) return;
    const order = { id: Date.now(), items: [...cart], total: getTotal(), date: new Date().toLocaleString(), status: 'Preparing' };
    setOrders([order, ...orders]);
    clearCart();
    return order;
  };
  return (
    <CartContext.Provider value={{ cart, orders, addToCart, removeFromCart, clearCart, getTotal, getCount, placeOrder }}>
      {children}
    </CartContext.Provider>
  );
};
const useCart = () => useContext(CartContext);

// ============ DATA ============
const CATEGORIES = [
  { id: 1, name: 'Pizza', icon: 'pizza-outline' },
  { id: 2, name: 'Burger', icon: 'fast-food-outline' },
  { id: 3, name: 'Sushi', icon: 'fish-outline' },
  { id: 4, name: 'Indian', icon: 'flame-outline' },
  { id: 5, name: 'Chinese', icon: 'restaurant-outline' },
  { id: 6, name: 'Dessert', icon: 'ice-cream-outline' },
];

const RESTAURANTS = [
  { id: 1, name: 'Pizza Palace', category: 'Pizza', rating: 4.8, deliveryTime: '25-35', deliveryFee: 2.50, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', menu: [
    { id: 101, name: 'Margherita', desc: 'Classic tomato, mozzarella, basil', price: 9.99, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200' },
    { id: 102, name: 'Pepperoni', desc: 'Spicy pepperoni, cheese, tomato sauce', price: 11.99, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200' },
    { id: 103, name: 'BBQ Chicken', desc: 'BBQ sauce, chicken, red onions', price: 12.99, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200' },
    { id: 104, name: 'Garlic Bread', desc: 'Crispy garlic bread with butter', price: 4.99, image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=200' },
  ]},
  { id: 2, name: 'Burger Box', category: 'Burger', rating: 4.5, deliveryTime: '20-30', deliveryFee: 1.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', menu: [
    { id: 201, name: 'Classic Burger', desc: 'Beef patty, lettuce, tomato, cheese', price: 8.99, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200' },
    { id: 202, name: 'Double Cheese', desc: 'Double beef, double cheese, pickles', price: 11.49, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=200' },
    { id: 203, name: 'Chicken Burger', desc: 'Crispy chicken, mayo, lettuce', price: 9.49, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=200' },
    { id: 204, name: 'Fries', desc: 'Crispy golden fries, seasoned', price: 3.99, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200' },
  ]},
  { id: 3, name: 'Sushi Zen', category: 'Sushi', rating: 4.9, deliveryTime: '30-40', deliveryFee: 3.00, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400', menu: [
    { id: 301, name: 'Salmon Nigiri', desc: '6 pieces of fresh salmon nigiri', price: 10.99, image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=200' },
    { id: 302, name: 'California Roll', desc: '8 pieces, crab, avocado, cucumber', price: 8.99, image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=200' },
    { id: 303, name: 'Dragon Roll', desc: 'Eel, avocado, spicy mayo', price: 13.99, image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=200' },
  ]},
  { id: 4, name: 'Curry House', category: 'Indian', rating: 4.7, deliveryTime: '30-45', deliveryFee: 2.00, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400', menu: [
    { id: 401, name: 'Butter Chicken', desc: 'Creamy tomato curry with chicken', price: 11.99, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200' },
    { id: 402, name: 'Lamb Biryani', desc: 'Spiced rice with tender lamb', price: 13.99, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200' },
    { id: 403, name: 'Naan Bread', desc: 'Freshly baked garlic naan', price: 2.99, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200' },
    { id: 404, name: 'Samosa', desc: 'Crispy pastry with spiced potatoes', price: 4.49, image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=200' },
  ]},
  { id: 5, name: 'Wok Star', category: 'Chinese', rating: 4.6, deliveryTime: '25-35', deliveryFee: 1.50, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400', menu: [
    { id: 501, name: 'Kung Pao Chicken', desc: 'Spicy chicken with peanuts', price: 10.99, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=200' },
    { id: 502, name: 'Fried Rice', desc: 'Egg fried rice with vegetables', price: 7.99, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200' },
    { id: 503, name: 'Spring Rolls', desc: 'Crispy vegetable spring rolls', price: 5.49, image: 'https://images.unsplash.com/photo-1548507200-b4e71e5e198e?w=200' },
  ]},
  { id: 6, name: 'Sweet Tooth', category: 'Dessert', rating: 4.8, deliveryTime: '20-30', deliveryFee: 2.50, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400', menu: [
    { id: 601, name: 'Chocolate Cake', desc: 'Rich dark chocolate layered cake', price: 6.99, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200' },
    { id: 602, name: 'Cheesecake', desc: 'New York style cheesecake', price: 7.49, image: 'https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=200' },
    { id: 603, name: 'Ice Cream Sundae', desc: 'Vanilla, chocolate, strawberry with toppings', price: 5.99, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=200' },
  ]},
];

// ============ HOME SCREEN ============
const HomeScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState(null);
  const { getCount } = useCart();
  const filtered = RESTAURANTS.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCat ? r.category === selectedCat : true;
    return matchSearch && matchCat;
  });
  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={s.header}>
        <View>
          <Text style={s.headerSmall}>Deliver to</Text>
          <Text style={s.headerTitle}>Bromley, London</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Ionicons name="cart-outline" size={28} color="#00CCBC" />
          {getCount() > 0 && <View style={s.badge}><Text style={s.badgeText}>{getCount()}</Text></View>}
        </TouchableOpacity>
      </View>
      <View style={s.searchBox}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput style={s.searchInput} placeholder="Search restaurants..." value={search} onChangeText={setSearch} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catRow}>
        <TouchableOpacity style={[s.catChip, !selectedCat && s.catChipActive]} onPress={() => setSelectedCat(null)}>
          <Ionicons name="grid-outline" size={20} color={!selectedCat ? '#fff' : '#00CCBC'} />
          <Text style={[s.catText, !selectedCat && s.catTextActive]}>All</Text>
        </TouchableOpacity>
        {CATEGORIES.map(cat => (
          <TouchableOpacity key={cat.id} style={[s.catChip, selectedCat === cat.name && s.catChipActive]} onPress={() => setSelectedCat(selectedCat === cat.name ? null : cat.name)}>
            <Ionicons name={cat.icon} size={20} color={selectedCat === cat.name ? '#fff' : '#00CCBC'} />
            <Text style={[s.catText, selectedCat === cat.name && s.catTextActive]}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList data={filtered} keyExtractor={i => String(i.id)} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={s.restCard} onPress={() => navigation.navigate('Restaurant', { restaurant: item })}>
            <Image source={{ uri: item.image }} style={s.restImage} />
            <View style={s.restInfo}>
              <Text style={s.restName}>{item.name}</Text>
              <View style={s.restMeta}>
                <View style={s.ratingBox}><Ionicons name="star" size={14} color="#FFD700" /><Text style={s.ratingText}>{item.rating}</Text></View>
                <Text style={s.metaText}>{item.deliveryTime} min</Text>
                <Text style={s.metaText}>Fee: {item.deliveryFee.toFixed(2)}</Text>
              </View>
              <Text style={s.restCat}>{item.category}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={s.emptyText}>No restaurants found</Text>}
      />
    </SafeAreaView>
  );
};

// ============ RESTAURANT SCREEN ============
const RestaurantScreen = ({ route, navigation }) => {
  const { restaurant } = route.params;
  const { addToCart, cart } = useCart();
  const getItemQty = (itemId) => {
    const found = cart.find(c => c.id === itemId && c.restaurantId === restaurant.id);
    return found ? found.qty : 0;
  };
  return (
    <SafeAreaView style={s.container}>
      <Image source={{ uri: restaurant.image }} style={s.restBanner} />
      <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <View style={s.restDetailHeader}>
        <Text style={s.restDetailName}>{restaurant.name}</Text>
        <View style={s.restMeta}>
          <View style={s.ratingBox}><Ionicons name="star" size={14} color="#FFD700" /><Text style={s.ratingText}>{restaurant.rating}</Text></View>
          <Text style={s.metaText}>{restaurant.deliveryTime} min</Text>
          <Text style={s.metaText}>Fee: {restaurant.deliveryFee.toFixed(2)}</Text>
        </View>
      </View>
      <Text style={s.menuTitle}>Menu</Text>
      <FlatList data={restaurant.menu} keyExtractor={i => String(i.id)} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={s.menuCard}>
            <Image source={{ uri: item.image }} style={s.menuImage} />
            <View style={s.menuInfo}>
              <Text style={s.menuName}>{item.name}</Text>
              <Text style={s.menuDesc}>{item.desc}</Text>
              <View style={s.menuBottom}>
                <Text style={s.menuPrice}>{item.price.toFixed(2)}</Text>
                <TouchableOpacity style={s.addBtn} onPress={() => addToCart(item, restaurant)}>
                  <Ionicons name="add" size={20} color="#fff" />
                  {getItemQty(item.id) > 0 && <Text style={s.addBtnQty}>{getItemQty(item.id)}</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

// ============ CART SCREEN ============
const CartScreen = ({ navigation }) => {
  const { cart, removeFromCart, addToCart, getTotal, getCount, placeOrder } = useCart();
  const deliveryFee = cart.length > 0 ? 2.50 : 0;
  const handleOrder = () => {
    const order = placeOrder();
    if (order) {
      Alert.alert('Order Placed!', 'Your order #' + order.id + ' is being prepared.\nEstimated delivery: 30-45 min', [
        { text: 'View Orders', onPress: () => navigation.navigate('OrdersTab') },
        { text: 'OK' }
      ]);
    }
  };
  if (cart.length === 0) return (
    <SafeAreaView style={[s.container, s.centerContent]}>
      <Ionicons name="cart-outline" size={80} color="#ccc" />
      <Text style={s.emptyTitle}>Your cart is empty</Text>
      <Text style={s.emptySubtitle}>Add items from a restaurant to get started</Text>
      <TouchableOpacity style={s.greenBtn} onPress={() => navigation.navigate('HomeTab')}>
        <Text style={s.greenBtnText}>Browse Restaurants</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
  return (
    <SafeAreaView style={s.container}>
      <Text style={s.screenTitle}>Your Cart</Text>
      <FlatList data={cart} keyExtractor={(item, i) => item.id + '-' + item.restaurantId + i}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={s.cartItem}>
            <View style={{ flex: 1 }}>
              <Text style={s.cartItemName}>{item.name}</Text>
              <Text style={s.cartItemRest}>{item.restaurantName}</Text>
              <Text style={s.cartItemPrice}>{(item.price * item.qty).toFixed(2)}</Text>
            </View>
            <View style={s.qtyRow}>
              <TouchableOpacity style={s.qtyBtn} onPress={() => removeFromCart(item.id, item.restaurantId)}>
                <Ionicons name="remove" size={18} color="#00CCBC" />
              </TouchableOpacity>
              <Text style={s.qtyText}>{item.qty}</Text>
              <TouchableOpacity style={s.qtyBtn} onPress={() => addToCart(item, { id: item.restaurantId, name: item.restaurantName })}>
                <Ionicons name="add" size={18} color="#00CCBC" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <View style={s.cartSummary}>
        <View style={s.summaryRow}><Text style={s.summaryLabel}>Subtotal</Text><Text style={s.summaryValue}>{getTotal()}</Text></View>
        <View style={s.summaryRow}><Text style={s.summaryLabel}>Delivery Fee</Text><Text style={s.summaryValue}>{deliveryFee.toFixed(2)}</Text></View>
        <View style={[s.summaryRow, s.totalRow]}><Text style={s.totalLabel}>Total</Text><Text style={s.totalValue}>{(parseFloat(getTotal()) + deliveryFee).toFixed(2)}</Text></View>
        <TouchableOpacity style={s.orderBtn} onPress={handleOrder}>
          <Text style={s.orderBtnText}>Place Order ({getCount()} items)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ============ ORDERS SCREEN ============
const OrdersScreen = () => {
  const { orders } = useCart();
  if (orders.length === 0) return (
    <SafeAreaView style={[s.container, s.centerContent]}>
      <Ionicons name="receipt-outline" size={80} color="#ccc" />
      <Text style={s.emptyTitle}>No orders yet</Text>
      <Text style={s.emptySubtitle}>Your order history will appear here</Text>
    </SafeAreaView>
  );
  return (
    <SafeAreaView style={s.container}>
      <Text style={s.screenTitle}>Your Orders</Text>
      <FlatList data={orders} keyExtractor={i => String(i.id)} contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={s.orderCard}>
            <View style={s.orderHeader}>
              <Text style={s.orderId}>Order #{item.id}</Text>
              <View style={[s.statusBadge, item.status === 'Preparing' && { backgroundColor: '#FFF3CD' }]}>
                <Text style={[s.statusText, item.status === 'Preparing' && { color: '#856404' }]}>{item.status}</Text>
              </View>
            </View>
            <Text style={s.orderDate}>{item.date}</Text>
            {item.items.map((food, idx) => (
              <Text key={idx} style={s.orderItem}>{food.qty}x {food.name} - {(food.price * food.qty).toFixed(2)}</Text>
            ))}
            <View style={s.orderFooter}>
              <Text style={s.orderTotal}>Total: {item.total}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

// ============ ACCOUNT SCREEN ============
const AccountScreen = () => (
  <SafeAreaView style={[s.container, s.centerContent]}>
    <Ionicons name="person-circle-outline" size={100} color="#00CCBC" />
    <Text style={s.accountName}>Azeem</Text>
    <Text style={s.accountEmail}>azeem@fasthub.com</Text>
    <View style={s.accountMenu}>
      {['My Addresses', 'Payment Methods', 'Notifications', 'Help & Support', 'About'].map((item, i) => (
        <TouchableOpacity key={i} style={s.accountItem}>
          <Text style={s.accountItemText}>{item}</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      ))}
    </View>
  </SafeAreaView>
);

// ============ NAVIGATION ============
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Restaurant" component={RestaurantScreen} />
  </Stack.Navigator>
);

const TabNavigator = () => {
  const { getCount } = useCart();
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: '#00CCBC',
      tabBarInactiveTintColor: '#999',
      tabBarStyle: { paddingBottom: 5, height: 60 },
      tabBarIcon: ({ color, size }) => {
        let icon;
        if (route.name === 'HomeTab') icon = 'home-outline';
        else if (route.name === 'Cart') icon = 'cart-outline';
        else if (route.name === 'OrdersTab') icon = 'receipt-outline';
        else if (route.name === 'Account') icon = 'person-outline';
        return <Ionicons name={icon} size={size} color={color} />;
      },
    })}>
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ tabBarBadge: getCount() > 0 ? getCount() : undefined }} />
      <Tab.Screen name="OrdersTab" component={OrdersScreen} options={{ tabBarLabel: 'Orders' }} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </CartProvider>
  );
}

// ============ STYLES ============
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  centerContent: { justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff' },
  headerSmall: { fontSize: 12, color: '#999' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  badge: { position: 'absolute', top: -8, right: -8, backgroundColor: '#FF4444', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 16, borderRadius: 12, padding: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16 },
  catRow: { paddingHorizontal: 12, maxHeight: 50 },
  catChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, marginHorizontal: 4, elevation: 1, borderWidth: 1, borderColor: '#e0e0e0' },
  catChipActive: { backgroundColor: '#00CCBC', borderColor: '#00CCBC' },
  catText: { marginLeft: 6, fontSize: 13, color: '#333', fontWeight: '500' },
  catTextActive: { color: '#fff' },
  restCard: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6 },
  restImage: { width: '100%', height: 180 },
  restInfo: { padding: 14 },
  restName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  restMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 12 },
  ratingBox: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 13, fontWeight: '600', color: '#333' },
  metaText: { fontSize: 13, color: '#666' },
  restCat: { fontSize: 12, color: '#00CCBC', marginTop: 4, fontWeight: '500' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 16 },
  restBanner: { width: '100%', height: 220 },
  backBtn: { position: 'absolute', top: 50, left: 16, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: 8 },
  restDetailHeader: { padding: 16, backgroundColor: '#fff' },
  restDetailName: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  menuTitle: { fontSize: 20, fontWeight: 'bold', padding: 16, color: '#333' },
  menuCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, overflow: 'hidden', elevation: 2 },
  menuImage: { width: 100, height: 100 },
  menuInfo: { flex: 1, padding: 12, justifyContent: 'space-between' },
  menuName: { fontSize: 16, fontWeight: '600', color: '#333' },
  menuDesc: { fontSize: 12, color: '#999', marginTop: 2 },
  menuBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  menuPrice: { fontSize: 16, fontWeight: 'bold', color: '#00CCBC' },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#00CCBC', borderRadius: 20, padding: 6, paddingHorizontal: 10 },
  addBtnQty: { color: '#fff', fontWeight: 'bold', marginLeft: 4 },
  screenTitle: { fontSize: 24, fontWeight: 'bold', padding: 16, color: '#333' },
  cartItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 10, elevation: 1 },
  cartItemName: { fontSize: 16, fontWeight: '600', color: '#333' },
  cartItemRest: { fontSize: 12, color: '#999', marginTop: 2 },
  cartItemPrice: { fontSize: 15, fontWeight: 'bold', color: '#00CCBC', marginTop: 4 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyBtn: { borderWidth: 1, borderColor: '#00CCBC', borderRadius: 15, width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
  qtyText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cartSummary: { backgroundColor: '#fff', padding: 20, borderTopWidth: 1, borderTopColor: '#eee' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: '#666' },
  summaryValue: { fontSize: 14, color: '#333' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10, marginTop: 4 },
  totalLabel: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#00CCBC' },
  orderBtn: { backgroundColor: '#00CCBC', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 12 },
  orderBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: '#999', marginTop: 8, textAlign: 'center' },
  greenBtn: { backgroundColor: '#00CCBC', borderRadius: 12, padding: 14, paddingHorizontal: 30, marginTop: 20 },
  greenBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  orderCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  statusBadge: { backgroundColor: '#D4EDDA', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 12, fontWeight: '600', color: '#155724' },
  orderDate: { fontSize: 12, color: '#999', marginTop: 4 },
  orderItem: { fontSize: 14, color: '#555', marginTop: 6 },
  orderFooter: { borderTopWidth: 1, borderTopColor: '#eee', marginTop: 10, paddingTop: 10 },
  orderTotal: { fontSize: 16, fontWeight: 'bold', color: '#00CCBC' },
  accountName: { fontSize: 24, fontWeight: 'bold', marginTop: 16, color: '#333' },
  accountEmail: { fontSize: 14, color: '#999', marginTop: 4 },
  accountMenu: { width: '100%', marginTop: 30 },
  accountItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  accountItemText: { fontSize: 16, color: '#333' },
});
