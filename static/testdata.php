<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/documentation/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'plkn_om5a1' );

/** Database username */
define( 'DB_USER', 'plkn_om5a1' );

/** Database password */
define( 'DB_PASSWORD', 'B.rZYsS*ne1mNyUH8@[94[(4' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'f7TPRv8HlpQZHjjZceX1awYzSt6akeJ54x0Hax57ybQAu1hOE3bUsoZ93VNn8vOm');
define('SECURE_AUTH_KEY',  'N6c9fieZCwxmG2aTMUtY2flJj7KUzNIBbSSFvJD0MKjkSJLaIPtnQBkBWgDQl1SR');
define('LOGGED_IN_KEY',    '5ctKeYh8fTyQmttPhTPdTGo3BQd3abQdANw28wOqYpoBnfalJMekxfkOTYmDFuWt');
define('NONCE_KEY',        'Z56zgKJ3bl8nMtdPG6vetY5WKO12njFWWKziLu0mN02sJYCQVBuX1C3bQX1gGZR3');
define('AUTH_SALT',        'BMBjZz6a59CBqNWxIPWzhi3vsOCmNWWs51UDaLjxZOe7FXlKUPemN0rNy8wXznFV');
define('SECURE_AUTH_SALT', 'RxyjAfdoBaLL8WJ3FROIDnALZziHGbIGh9cFXA4b8o67FbVfehNmzbhZoTFe1XwC');
define('LOGGED_IN_SALT',   'JDnjt9FWHgBhJcOJVBgiJEljaUs0pUpp5fJdVMEpv4RYyIsUjhjSAgTd6bX0vHg3');
define('NONCE_SALT',       '5JRs3WodH2BS62i6IBbmbsu6bIfRHpo7JuH5WZIUQsWr6xzakdpWEK7fwB3NdXZf');

/**
 * Other customizations.
 */
define('WP_TEMP_DIR',dirname(__FILE__).'/wp-content/uploads');


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'rfdb_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/documentation/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
