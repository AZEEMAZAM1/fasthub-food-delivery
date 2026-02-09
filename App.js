import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, StyleSheet, StatusBar, SafeAreaView } from 'react-native';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [cart, setCart] = useState([]);

  const restaurants = [
    { id: 1, name: 'Pizza Palace', cuisine: 'Italian', rating: 4.5, deliveryTime: '20-30 min' },
    { id: 2, name: 'Sushi Express', cuisine: 'Japanese', rating: 4.7, deliveryTime: '25-35 min' },
    { id: 3, name: 'Burger King', cuisine: 'American', rating: 4.3, deliveryTime: '15-25 min' },
    { id: 4, name: 'Taco Town', cuisine: 'Mexican', rating: 4.6, deliveryTime: '20-30 min' },
  ];

  const menuItems = [
    { id: 1, restaurantId: 1, name: 'Margherita Pizza', price: 12.99, category: 'Main' },
    { id: 2, restaurantId: 1, name: 'Pepperoni Pizza', price: 14.99, category: 'Main' },
    { id: 3, restaurantId: 2, name: 'California Roll', price: 10.99, category: 'Sushi' },
    { id: 4, restaurantId: 3, name: 'Cheeseburger', price: 9.99, category: 'Burgers' },
  ];

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0).toFixed(2);
  };

  const HomeScreen = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>FastHub Delivery</Text>
        <TextInput 
          style={styles.searchBar}
          placeholder="Search for restaurants or dishes"
          placeholderTextColor="#999"
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Restaurants</Text>
        {restaurants.map(restaurant => (
          <TouchableOpacity 
            key={restaurant.id}
            style={styles.card}
            onPress={() => setCurrentScreen('menu')}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{restaurant.name}</Text>
              <Text style={styles.rating}>⭐ {restaurant.rating}</Text>
            </View>
            <Text style={styles.cardSubtitle}>{restaurant.cuisine}</Text>
            <Text style={styles.deliveryTime}>🚚 {restaurant.deliveryTime}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const MenuScreen = () => (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => setCurrentScreen('home')} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      
      <Text style={styles.pageTitle}>Menu</Text>
      
      {menuItems.map(item => (
        <View key={item.id} style={styles.menuItem}>
          <View>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>${item.price}</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => addToCart(item)}
          >
            <Text style={styles.addButtonText}>Add +</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );

  const CartScreen = () => (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => setCurrentScreen('home')} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      
      <Text style={styles.pageTitle}>Your Cart</Text>
      
      {cart.length === 0 ? (
        <Text style={styles.emptyCart}>Your cart is empty</Text>
      ) : (
        <>
          {cart.map(item => (
            <View key={item.id} style={styles.cartItem}>
              <View>
                <Text style={styles.cartItemName}>{item.name}</Text>
                <Text style={styles.cartItemPrice}>${item.price} x {item.qty}</Text>
              </View>
              <Text style={styles.cartItemTotal}>${(item.price * item.qty).toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalPrice}>${getTotalPrice()}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton}>
            <Text style={styles.checkoutText}>Checkout</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'menu' && <MenuScreen />}
      {currentScreen === 'cart' && <CartScreen />}
      
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => setCurrentScreen('home')} style={styles.navButton}>
          <Text style={styles.navText}>🏠 Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentScreen('menu')} style={styles.navButton}>
          <Text style={styles.navText}>🍔 Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentScreen('cart')} style={styles.navButton}>
          <Text style={styles.navText}>🛒 Cart ({cart.length})</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#00CCBC',
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  searchBar: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  rating: {
    fontSize: 16,
    color: '#666',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  deliveryTime: {
    fontSize: 14,
    color: '#00CCBC',
  },
  backButton: {
    padding: 15,
  },
  backText: {
    fontSize: 16,
    color: '#00CCBC',
    fontWeight: '600',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 15,
    paddingTop: 0,
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#00CCBC',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyCart: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 50,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#666',
  },
  cartItemTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00CCBC',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 8,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00CCBC',
  },
  checkoutButton: {
    backgroundColor: '#00CCBC',
    padding: 18,
    margin: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingBottom: 10,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  navText: {
    fontSize: 14,
    color: '#333',
  },
});
