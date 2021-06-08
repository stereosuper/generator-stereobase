<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', '<%= dbname %>');

/** MySQL database username */
define('DB_USER', '<%= dbuser %>');

/** MySQL database password */
define('DB_PASSWORD', '<%= dbpass %>');

/** MySQL hostname */
define('DB_HOST', '127.0.0.1');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'B;e_IrRddUllD&`6tfk=Wq^T^(K7>,zLz{chzvSXSFJKVp<7agm|,vOjrIqi|ORk');
define('SECURE_AUTH_KEY',  'UbW-l/lR!0KJ.D.<S!d#QHX%*4hT9Y>YIL#O7sYJdINL3#d2GK=tt[?I9>t65JrY');
define('LOGGED_IN_KEY',    '5k))f?^F5)E|(*&468x@xth39p=IGh*XsR(gVcDk~;t/9(D>jewi X5af|~Bl.g>');
define('NONCE_KEY',        ']1&A-khGlO=#cfD2!.B)y>4.{boIfezh:feJy?m08w{-cTn4<m/.]hr%EO4@RE!U');
define('AUTH_SALT',        '{ExfxZ&W@8J)kjE0,4+@fIQ6U`6{#j:R?0w+r9aKdo9Odg%ww(VBbK=D+d]f!jz{');
define('SECURE_AUTH_SALT', 'xmuz5S.-8l3Zd6VAZTV9^8i0tH7P5ZrDJS:rR`l!-K~0IL)=KDATgb98_Ker!}to');
define('LOGGED_IN_SALT',   '|.f*[i!iRn}Y;Pr|?!p5(:Z}?yi`u|j$a4mSrzTinJ@+hS*^dehv+=vdfr|=H[ZP');
define('NONCE_SALT',       'l%$-|l,Cnw-.,`^m >J=En-^6e:lNM?XWCi-_ul]8~+(=d>sN-uXG3J+T_,lAxb=');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = '<%= dbprefix %>_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', true);

define('WP_POST_REVISIONS', 5);
define('EMPTY_TRASH_DAYS', 10);
define('WP_AUTO_UPDATE_CORE', true);
define('DISALLOW_FILE_EDIT', true);
define('DISALLOW_UNFILTERED_HTML', true);

<% if (isMultisite) { %>
define('WP_ALLOW_MULTISITE', true);
// define('MULTISITE', true);
// define('SUBDOMAIN_INSTALL', false);
// define('DOMAIN_CURRENT_SITE', '<%= dbprefix %>.local');
// define('PATH_CURRENT_SITE', '/');
// define('SITE_ID_CURRENT_SITE', 1);
// define('BLOG_ID_CURRENT_SITE', 1);
<% } %>

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
