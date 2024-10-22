window.onload = function() {
  const firebaseConfig = {
    apiKey: "AIzaSyBbnJ_6PvC8sEdfdAt_tauHKtH0wxRh_-M",
    authDomain: "bridge-21158.firebaseapp.com",
    databaseURL: "https://bridge-21158-default-rtdb.firebaseio.com",
    projectId: "bridge-21158",
    storageBucket: "bridge-21158.appspot.com",
    messagingSenderId: "1092879871359",
    appId: "1:1092879871359:web:8139738ceed9dc248dbe4a"
  };

  firebase.initializeApp(firebaseConfig);
  var db = firebase.database();

  class CHAT {
    home() {
      document.body.innerHTML = '';
      this.create_title();
      this.create_join_form();
    }

    chat() {
      this.create_title();
      this.create_chat();
    }

    create_title() {
      var title_container = document.createElement('div');
      title_container.setAttribute('id', 'title_container');
      var title_inner_container = document.createElement('div');
      title_inner_container.setAttribute('id', 'title_inner_container');
      
      var title = document.createElement('h1');
      title.setAttribute('id', 'title');
      title.textContent = 'MCST BRIDGE';

      title_inner_container.append(title);
      title_container.append(title_inner_container);
      document.body.append(title_container);
    }

    create_join_form() {
      var parent = this;

      var login_container = document.createElement('div');
      login_container.setAttribute('id', 'login_container');

      var login_inner_container = document.createElement('div');
      login_inner_container.setAttribute('id', 'join_inner_container');

      var name_input = document.createElement('input');
      name_input.setAttribute('id', 'name_input');
      name_input.setAttribute('placeholder', 'Name');
      name_input.setAttribute('maxlength', 50);
      name_input.classList.add('input-field');

      var password_input = document.createElement('input');
      password_input.setAttribute('id', 'password_input');
      password_input.setAttribute('placeholder', 'Password');
      password_input.setAttribute('type', 'password');
      password_input.classList.add('input-field');

      var login_button = document.createElement('button');
      login_button.textContent = 'Login';
      login_button.classList.add('button');
      login_button.onclick = function() {
        parent.login(name_input.value, password_input.value);
      };

      var create_user_button = document.createElement('button');
      create_user_button.textContent = 'Create User';
      create_user_button.classList.add('button');
      create_user_button.onclick = function() {
        parent.create_user(name_input.value, password_input.value);
      };

      var button_container = document.createElement('div');
      button_container.setAttribute('id', 'join_button_container');
      button_container.append(login_button, create_user_button);
      login_inner_container.append(name_input, password_input, button_container);
      login_container.append(login_inner_container);
      document.body.append(login_container);
    }

    create_user(name, password) {
      if (!name || !password) {
        alert('Please enter both name and password to create a user.');
        return;
      }

      // Check if the user already exists
      db.ref('users/' + name).once('value').then(snapshot => {
        if (snapshot.exists()) {
          alert('User already exists. Please choose a different name.');
        } else {
          // Create a new user
          db.ref('users/' + name).set({
            password: password
          })
          .then(() => {
            alert('User created successfully! You can now log in.');
          })
          .catch(error => {
            alert('Error creating user: ' + error.message);
          });
        }
      });
    }

    login(name, password) {
      if (!name || !password) {
        alert('Please enter both name and password.');
        return;
      }

      db.ref('users/' + name).once('value').then(snapshot => {
        if (snapshot.exists() && snapshot.val().password === password) {
          this.save_name(name);
          this.clear_screen();
          this.chat();
        } else {
          alert('Invalid credentials. Please try again.');
        }
      });
    }

    clear_screen() {
      document.body.innerHTML = ''; // Clear the screen content
    }

    create_chat() {
      var parent = this;

      var title_container = document.getElementById('title_container');
      var title = document.getElementById('title');
      title_container.classList.add('chat_title_container');
      title.classList.add('chat_title');

      var chat_container = document.createElement('div');
      chat_container.setAttribute('id', 'chat_container');

      var chat_inner_container = document.createElement('div');
      chat_inner_container.setAttribute('id', 'chat_inner_container');

      var chat_content_container = document.createElement('div');
      chat_content_container.setAttribute('id', 'chat_content_container');

      var chat_input_container = document.createElement('div');
      chat_input_container.setAttribute('id', 'chat_input_container');

      var chat_input_send = document.createElement('button');
      chat_input_send.setAttribute('id', 'chat_input_send');
      chat_input_send.setAttribute('disabled', true);
      chat_input_send.innerHTML = '<i class="fa fa-paper-plane-o"></i>'; // Fixed innerHTML

      var chat_input = document.createElement('input');
      chat_input.setAttribute('id', 'chat_input');
      chat_input.setAttribute('maxlength', 1000);
      chat_input.placeholder = `${parent.get_name()}. Say something...`; // Fixed template literal

      chat_input.onkeyup = function() {
        if (chat_input.value.length > 0) {
          chat_input_send.removeAttribute('disabled');
          chat_input_send.classList.add('enabled');
          chat_input_send.onclick = function() {
            if (chat_input.value.length <= 0) {
              return;
            }
            parent.send_message(chat_input.value);
            chat_input.value = '';
            chat_input.focus();
          };
        } else {
          chat_input_send.setAttribute('disabled', true);
          chat_input_send.classList.remove('enabled');
        }
      };

      // Direct message section
      var direct_msg_container = document.createElement('div');
      direct_msg_container.setAttribute('id', 'direct_msg_container');

      var direct_msg_input = document.createElement('input');
      direct_msg_input.setAttribute('id', 'direct_msg_input');
      direct_msg_input.setAttribute('maxlength', 1000);
      direct_msg_input.placeholder = 'Direct message to (User ID): Message...';

      var direct_msg_send = document.createElement('button');
      direct_msg_send.setAttribute('id', 'direct_msg_send');
      direct_msg_send.setAttribute('disabled', true);
      direct_msg_send.innerHTML = '<i class="fa fa-paper-plane-o"></i>'; // Fixed innerHTML

      direct_msg_input.onkeyup = function() {
        if (direct_msg_input.value.length > 0) {
          direct_msg_send.removeAttribute('disabled');
          direct_msg_send.classList.add('enabled');
          direct_msg_send.onclick = function() {
            if (direct_msg_input.value.length <= 0) {
              return;
            }
            parent.send_direct_message(direct_msg_input.value);
            direct_msg_input.value = '';
            direct_msg_input.focus();
          };
        } else {
          direct_msg_send.setAttribute('disabled', true);
          direct_msg_send.classList.remove('enabled');
        }
      };

      // Add filter buttons
      var filter_buttons = document.createElement('div');
      var show_all_button = document.createElement('button');
      show_all_button.textContent = 'Show All Messages';
      show_all_button.classList.add('message_filter_button');
      show_all_button.onclick = function() {
        parent.display_all_messages();
      };

      var show_direct_button = document.createElement('button');
      show_direct_button.textContent = 'Show Direct Messages';
      show_direct_button.classList.add('message_filter_button');
      show_direct_button.onclick = function() {
        parent.display_direct_messages();
      };

      filter_buttons.append(show_all_button, show_direct_button);
      direct_msg_container.append(direct_msg_input, direct_msg_send);
      chat_input_container.append(chat_input, chat_input_send);
      chat_inner_container.append(filter_buttons, chat_content_container, chat_input_container, direct_msg_container);
      chat_container.append(chat_inner_container);
      document.body.append(chat_container);

      // Logout button
      var logout_button = document.createElement('button');
      logout_button.setAttribute('id', 'logout_button');
      logout_button.textContent = 'Logout';
      logout_button.onclick = function() {
        parent.relogin();
      };

      // Append the logout button to the chat container
      chat_container.append(logout_button);

      parent.refresh_chat();
    }

    save_name(name) {
      localStorage.setItem('name', name);
    }

    send_message(message) {
      var parent = this;

      if (parent.get_name() == null || message == null) {
        return;
      }

      db.ref('public_chats/').push({
        name: parent.get_name(),
        message: message,
        timestamp: Date.now()
      })
      .then(function() {
        parent.refresh_chat();
      });
    }

    send_direct_message(directMessage) {
      var parent = this;

      if (parent.get_name() == null || directMessage == null) {
        return;
      }

      const [recipient, ...messageParts] = directMessage.split(':');
      const message = messageParts.join(':').trim();

      if (!recipient || !message) {
        return; // Invalid input
      }

      db.ref('direct_messages/').push({
        from: parent.get_name(),
        to: recipient.trim(),
        message: message,
        timestamp: Date.now()
      })
      .then(function() {
        parent.notify_user(`You have sent a direct message to ${recipient.trim()}`); // Fixed template literal
      });
    }

    notify_user(message) {
      alert(message);
    }

    get_name() {
      if (localStorage.getItem('name') != null) {
        return localStorage.getItem('name');
      } else {
        this.home();
        return null;
      }
    }

    refresh_chat() {
      var chat_content_container = document.getElementById('chat_content_container');

      db.ref('public_chats/').on('value', function(messages_object) {
        chat_content_container.innerHTML = '';

        if (messages_object.numChildren() === 0) {
          return;
        }

        var messages = Object.values(messages_object.val());
        messages.forEach(function(data) {
          var name = data.name;
          var message = data.message;

          var message_container = document.createElement('div');
          message_container.setAttribute('class', 'message_container');

          var message_inner_container = document.createElement('div');
          message_inner_container.setAttribute('class', 'message_inner_container');

          var message_user_container = document.createElement('div');
          message_user_container.setAttribute('class', 'message_user_container');

          var message_user = document.createElement('p');
          message_user.setAttribute('class', 'message_user');
          message_user.textContent = name; // Fixed to use direct text

          var message_content_container = document.createElement('div');
          message_content_container.setAttribute('class', 'message_content_container');

          var message_content = document.createElement('p');
          message_content.setAttribute('class', 'message_content');
          message_content.textContent = message; // Fixed to use direct text

          message_user_container.append(message_user);
          message_content_container.append(message_content);
          message_inner_container.append(message_user_container, message_content_container);
          message_container.append(message_inner_container);

          chat_content_container.append(message_container);
        });

        chat_content_container.scrollTop = chat_content_container.scrollHeight;
      });
    }

    display_all_messages() {
      var chat_content_container = document.getElementById('chat_content_container');

      db.ref('public_chats/').on('value', function(messages_object) {
        chat_content_container.innerHTML = '';
        var messages = Object.values(messages_object.val());
        messages.forEach(function(data) {
          var name = data.name;
          var message = data.message;
          var message_container = document.createElement('div');
          message_container.setAttribute('class', 'message_container');
          message_container.innerHTML = `<strong>${name}:</strong> ${message}`; // Fixed to use template literals
          chat_content_container.append(message_container);
        });
      });
    }

    display_direct_messages() {
      var chat_content_container = document.getElementById('chat_content_container');
      var currentUserName = this.get_name(); // Get the current user's name

      db.ref('direct_messages/').on('value', function(messages_object) {
        chat_content_container.innerHTML = '';
        var messages = Object.values(messages_object.val());

        messages.forEach(function(data) {
          var from = data.from;
          var to = data.to;
          var message = data.message;

          // Only display messages that are sent to the current user
          if (to === currentUserName) {
            var message_container = document.createElement('div');
            message_container.setAttribute('class', 'message_container');
            message_container.innerHTML = `<strong>Direct from ${from}:</strong> ${message}`; // Fixed to use template literals
            chat_content_container.append(message_container);
          }
        });
      });
    }

    relogin() {
      localStorage.clear(); // Clear user data
      this.home(); // Redirect to home/login page
    }
  }

  var app = new CHAT();

  if (app.get_name() != null) {
    app.chat();
  }
};
