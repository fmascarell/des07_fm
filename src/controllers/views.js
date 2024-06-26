import { request, response } from 'express';
import { getProductService } from '../services/products.js';
import { getCartByIdService } from '../services/carts.js';

export const homeView = async (req = request, res = response) => {
  try {
    const limit = 50;
    const { payload } = await getProductService({ limit });
    const user = req.session.user;

    console.log('Renderizando vista home con usuario:', user);

    return res.render('home', {
      productos: payload,
      styles: 'styles.css',
      title: 'Home',
      user,
    });
  } catch (error) {
    console.error('Error al renderizar la vista home:', error);
    return res.status(500).send('Error interno del servidor');
  }
};

export const realtimeproductsView = async (req = request, res = response) => {
  try {
    const user = req.session.user;
    console.log('Renderizando vista de productos en tiempo real con usuario:', user);

    return res.render('realTimeProducts', {
      title: 'Real Time',
      styles: 'styles.css',
      user,
    });
  } catch (error) {
    console.error('Error al renderizar la vista de productos en tiempo real:', error);
    return res.status(500).send('Error interno del servidor');
  }
};

export const chatView = async (req = request, res = response) => {
  try {
    const user = req.session.user;
    console.log('Renderizando vista de chat con usuario:', user);

    return res.render('chat', { styles: 'chat.css', title: 'Chat', user });
  } catch (error) {
    console.error('Error al renderizar la vista de chat:', error);
    return res.status(500).send('Error interno del servidor');
  }
};

export const productsView = async (req = request, res = response) => {
  try {
    const result = await getProductService({ ...req.query });
    const user = req.session.user;
    console.log('Renderizando vista de productos con usuario:', user);

    return res.render('products', {
      title: 'Productos',
      result,
      styles: 'products.css',
      user,
    });
  } catch (error) {
    console.error('Error al renderizar la vista de productos:', error);
    return res.status(500).send('Error interno del servidor');
  }
};

export const cartView = async (req = request, res = response) => {
  try {
    const { cid } = req.params;
    const carrito = await getCartByIdService(cid);
    const user = req.session.user;
    console.log('Renderizando vista del carrito con usuario:', user);

    return res.render('cart', {
      title: 'Carrito',
      carrito,
      styles: 'cart.css',
      user,
    });
  } catch (error) {
    console.error('Error al renderizar la vista del carrito:', error);
    return res.status(500).send('Error interno del servidor');
  }
};

export const loginGet = async (req = request, res = response) => {
  try {
    if (req.session.user) {
      console.log('Usuario ya está logueado, redirigiendo a home.');
      return res.redirect('/');
    }

    return res.render('login', { title: 'Login', styles: 'loginregister.css' });
  } catch (error) {
    console.error('Error durante el GET de login:', error);
    return res.status(500).send('Error interno del servidor');
  }
};

export const registerGet = async (req = request, res = response) => {
  try {
    if (req.session.user) {
      console.log('Usuario ya está logueado, redirigiendo a home.');
      return res.redirect('/');
    }

    return res.render('register', {
      title: 'Registro',
      styles: 'loginregister.css',
    });
  } catch (error) {
    console.error('Error durante el GET de registro:', error);
    return res.status(500).send('Error interno del servidor');
  }
};

export const login = async (req = request, res = response) => {
  try {
    if (!req.user) {
      console.log('Error en el login, redirigiendo a la página de login.');
      return res.redirect('/login');
    }

    console.log('Login exitoso, usuario:', req.user);
    req.session.user = {
      name: req.user.name,
      lastName: req.user.lastName,
      email: req.user.email,
      rol: req.user.rol,
      image: req.user.image,
    };
    return res.redirect('/');
  } catch (error) {
    console.error('Error durante el POST de login:', error);
    return res.status(500).send('Error interno del servidor');
  }
};

export const registerPost = async (req = request, res = response) => {
  try {
    if (!req.user) {
      console.log('Error en el registro, redirigiendo a la página de registro.');
      return res.redirect('/register');
    }

    console.log('Registro exitoso, usuario:', req.user);
    return res.redirect('/login');
  } catch (error) {
    console.error('Error durante el POST de registro:', error);
    return res.status(500).send('Error interno del servidor');
  }
};

export const logout = async (req = request, res = response) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error durante el logout:', err);
        return res.send({ status: false, body: err });
      } else {
        console.log('Logout exitoso, redirigiendo a la página de login.');
        return res.redirect('/login');
      }
    });
  } catch (error) {
    console.error('Error durante el logout:', error);
    return res.status(500).send('Error interno del servidor');
  }
};
