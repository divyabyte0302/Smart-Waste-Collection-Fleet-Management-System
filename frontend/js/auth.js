/**
 * Smart Waste Collection Management System - User Authentication & Role Redirection Module
 */
const AuthModule = {
  currentUser: null,

  init() {
    this.setupEventListeners();
    this.checkSession();
  },

  setupEventListeners() {
    // Auth Tab Switcher (Sign In vs Register)
    const tabLogin = document.getElementById('tab-auth-login');
    const tabRegister = document.getElementById('tab-auth-register');
    const formLogin = document.getElementById('form-auth-login');
    const formRegister = document.getElementById('form-auth-register');

    if (tabLogin && tabRegister) {
      tabLogin.addEventListener('click', () => {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        formLogin.style.display = 'block';
        formRegister.style.display = 'none';
      });

      tabRegister.addEventListener('click', () => {
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        formRegister.style.display = 'block';
        formLogin.style.display = 'none';
      });
    }

    // Login Form Submit
    if (formLogin) {
      formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const submitBtn = formLogin.querySelector('button[type="submit"]');

        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Signing In...';

        try {
          await this.login(email, password);
        } catch (err) {
          UI.toast(err.message || 'Login failed. Please check your credentials.', 'error');
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Sign In to Portal';
        }
      });
    }

    // Citizen Registration Form Submit
    if (formRegister) {
      formRegister.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const phone = document.getElementById('reg-phone').value;
        const address = document.getElementById('reg-address').value;
        const submitBtn = formRegister.querySelector('button[type="submit"]');

        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Creating Account...';

        try {
          const res = await API.auth.register({ name, email, password, phone, address });
          UI.toast('Registration successful! Redirecting to Citizen Portal...', 'success');
          
          localStorage.setItem('smartwaste_token', res.data.token);
          localStorage.setItem('smartwaste_user', JSON.stringify(res.data.user));
          this.currentUser = res.data.user;
          State.currentUser = res.data.user;

          this.redirect(res.data.user);
        } catch (err) {
          UI.toast(err.message || 'Registration failed.', 'error');
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Create Resident Account';
        }
      });
    }

    // Quick One-Click Demo Role Tiles
    document.querySelectorAll('.demo-tile').forEach(tile => {
      tile.addEventListener('click', async (e) => {
        const email = tile.dataset.email;
        const password = tile.dataset.password;
        
        document.getElementById('login-email').value = email;
        document.getElementById('login-password').value = password;

        UI.toast(`Logging in as ${tile.querySelector('.demo-tile-role').innerText}...`, 'success');
        try {
          await this.login(email, password);
        } catch (err) {
          UI.toast(err.message, 'error');
        }
      });
    });

    // Sign Out Button
    const btnSignout = document.getElementById('btn-header-signout');
    if (btnSignout) {
      btnSignout.addEventListener('click', () => {
        this.logout();
      });
    }
  },

  async login(email, password) {
    const res = await API.auth.login({ email, password });
    
    // Save authentication state
    localStorage.setItem('smartwaste_token', res.data.token);
    localStorage.setItem('smartwaste_user', JSON.stringify(res.data.user));
    this.currentUser = res.data.user;
    State.currentUser = res.data.user;

    UI.toast(`Authenticated as ${res.data.user.name} (${res.data.user.role})`, 'success');
    this.redirect(res.data.user);
  },

  redirect(user) {
    const role = user.role;
    State.setRole(role);

    // Hide Auth Screen
    const authPortal = document.getElementById('portal-auth');
    if (authPortal) authPortal.style.display = 'none';

    // Update Header User Profile Pill
    const profileWidget = document.getElementById('header-user-profile');
    const avatarImg = document.getElementById('header-user-avatar');
    const nameSpan = document.getElementById('header-user-name');
    const roleSpan = document.getElementById('header-user-role');

    if (profileWidget) profileWidget.style.display = 'flex';
    if (avatarImg) avatarImg.src = user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
    if (nameSpan) nameSpan.innerText = user.name;
    if (roleSpan) roleSpan.innerText = `● ${role}`;

    // Redirect to the specific module based on user role
    const citizenSec = document.getElementById('portal-citizen');
    const adminSec = document.getElementById('portal-admin');
    const driverSec = document.getElementById('portal-driver');

    if (citizenSec) citizenSec.style.display = role === 'CITIZEN' ? 'block' : 'none';
    if (adminSec) adminSec.style.display = role === 'ADMIN' ? 'block' : 'none';
    if (driverSec) driverSec.style.display = role === 'DRIVER' ? 'block' : 'none';

    // Module-specific initializers
    if (role === 'ADMIN') {
      AdminModule.renderAll();
    } else if (role === 'DRIVER') {
      if (user.assigned_vehicle) {
        DriverModule.currentVehicle = user.assigned_vehicle;
      }
      DriverModule.syncDriverData();
    } else if (role === 'CITIZEN') {
      // Auto fill citizen form with user profile
      const nameInput = document.getElementById('citizen-name');
      const phoneInput = document.getElementById('citizen-phone');
      const addressInput = document.getElementById('complaint-address');

      if (nameInput) nameInput.value = user.name || '';
      if (phoneInput) phoneInput.value = user.phone || '';
      if (addressInput && user.address) addressInput.value = user.address;
    }
  },

  logout() {
    localStorage.removeItem('smartwaste_token');
    localStorage.removeItem('smartwaste_user');
    this.currentUser = null;
    State.currentUser = null;

    // Hide all portal modules
    document.getElementById('portal-citizen').style.display = 'none';
    document.getElementById('portal-admin').style.display = 'none';
    document.getElementById('portal-driver').style.display = 'none';

    // Hide header user profile pill
    const profileWidget = document.getElementById('header-user-profile');
    if (profileWidget) profileWidget.style.display = 'none';

    // Show Auth Gatekeeper
    const authPortal = document.getElementById('portal-auth');
    if (authPortal) authPortal.style.display = 'block';

    UI.toast('Signed out successfully.', 'success');
  },

  async checkSession() {
    const savedToken = localStorage.getItem('smartwaste_token');
    const savedUserStr = localStorage.getItem('smartwaste_user');

    if (!savedToken || !savedUserStr) {
      this.presentAuthScreen();
      return;
    }

    try {
      const res = await API.auth.getMe();
      this.currentUser = res.data.user;
      State.currentUser = res.data.user;
      this.redirect(res.data.user);
    } catch {
      // Token expired or invalid
      this.logout();
    }
  },

  presentAuthScreen() {
    document.getElementById('portal-citizen').style.display = 'none';
    document.getElementById('portal-admin').style.display = 'none';
    document.getElementById('portal-driver').style.display = 'none';

    const profileWidget = document.getElementById('header-user-profile');
    if (profileWidget) profileWidget.style.display = 'none';

    const authPortal = document.getElementById('portal-auth');
    if (authPortal) authPortal.style.display = 'block';
  }
};
