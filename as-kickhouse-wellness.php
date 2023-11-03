<?php

/**
 * @wordpress-plugin
 * Plugin Name: Angelsmith - WellnessLiving Api Integration
 */

defined('ABSPATH') or die("Sorry!!! You can't access this file! ");
define('ASKH_SCHEDULING_APP_PATH', plugin_dir_path(__FILE__) . '/scheduling');
define('ASKH_INTRO_APP_PATH', plugin_dir_path(__FILE__) . '/introclass');
define('ASKH_COUNTDOWN_APP_PATH', plugin_dir_path(__FILE__) . '/countdown-app');



define('ASKH_SCHEDULING_ASSET_MANIFEST', ASKH_SCHEDULING_APP_PATH . '/build/asset-manifest.json');
define('ASKH_INTROCLASS_ASSET_MANIFEST', ASKH_INTRO_APP_PATH . '/build/asset-manifest.json');
define('ASKH_COUNTDOWN_ASSET_MANIFEST', ASKH_COUNTDOWN_APP_PATH . '/build/asset-manifest.json');
define('ASKH_INCLUDES', plugin_dir_path(__FILE__) . '/includes');

require_once(ASKH_INCLUDES . '/shortcode.php');
require_once(ASKH_INCLUDES . '/wellnessliving.php');
require_once(ASKH_INCLUDES . '/wellnessliving-endpoints.php');
