<!DOCTYPE html>
<html lang="{function.localeToHTML, defaultLang}">
<head>
	<title>{browserTitle}</title>
	<!-- BEGIN metaTags -->{function.buildMetaTag}<!-- END metaTags -->
    <link rel='stylesheet' id='bones-stylesheet-css'  href='http://guld.moderskeppet.se/wp-content/themes/Guld-tema/library/css/style.css?{config.cache-buster}' type='text/css' media='all' />
	<link rel="stylesheet" type="text/css" href="{relative_path}/stylesheet.css?{config.cache-buster}" />
	<!-- IF bootswatchCSS --><link id="bootswatchCSS" href="{bootswatchCSS}" rel="stylesheet" media="screen"><!-- ENDIF bootswatchCSS -->
	<!-- BEGIN linkTags -->{function.buildLinkTag}<!-- END linkTags -->

	<!--[if lt IE 9]>
  		<script src="//cdnjs.cloudflare.com/ajax/libs/es5-shim/2.3.0/es5-shim.min.js"></script>
  		<script src="//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7/html5shiv.min.js"></script>
  		<script src="//cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.min.js"></script>
  		<script>__lt_ie_9__ = 1;</script>
	<![endif]-->

	<script>
		var RELATIVE_PATH = "{relative_path}";
		var config = JSON.parse('{{configJSON}}');
		var app = {
			template: "{template.name}",
			user: JSON.parse('{{userJSON}}')
		};
	</script>
	<script src="{relative_path}/nodebb.min.js?{config.cache-buster}"></script>
	<!-- IMPORT partials/requirejs-config.tpl -->

	<!-- BEGIN scripts -->
	<script type="text/javascript" src="{scripts.src}"></script>
	<!-- END scripts -->

	<!-- IF useCustomJS -->
	{{customJS}}
	<!-- ENDIF useCustomJS -->
	<!-- IF useCustomCSS -->
	<style type="text/css">{{customCSS}}</style>
	<!-- ENDIF useCustomCSS -->
</head>

<body class="{bodyClass}">
	<nav id="menu" class="hidden">
		<section class="menu-profile">
			<!-- IF user.uid -->
			<!-- IF user.picture -->
			<img src="{user.picture}"/>
			<!-- ELSE -->
			<div class="user-icon" style="background-color: {user.icon:bgColor};">{user.icon:text}</div>
			<!-- ENDIF user.picture -->
			<i component="user/status" class="fa fa-fw fa-circle status {user.status}"></i>
			<!-- ENDIF user.uid -->
		</section>

		<section class="menu-section" data-section="navigation">
			<h3 class="menu-section-title">[[global:header.navigation]]</h3>
			<ul class="menu-section-list"></ul>
		</section>

		<!-- IF config.loggedIn -->
		<section class="menu-section" data-section="profile">
			<h3 class="menu-section-title">[[global:header.profile]]</h3>
			<ul class="menu-section-list" component="header/usercontrol"></ul>
		</section>
<!--
		<section class="menu-section" data-section="chats">
			<h3 class="menu-section-title">
				[[global:header.chats]]
				<i class="counter" component="chat/icon" data-content="0"></i>
			</h3>
			<ul class="menu-section-list chat-list"></ul>
		</section>
		//-->
		<!-- ENDIF config.loggedIn -->
	</nav>

<div id="container-outer">

			<header class="header" role="banner">

  <div class="header-top">
            <div class="header-top-inner wrap_nooverflow clearfix">
				       <!--
            <span class="header-top-user">{user.username}</span>
            <span class="iphonehide-innerblock header-top-playlist"><a href="https://guld.moderskeppet.se/erbjudande/">Erbjudanden</a></span>
            <span class="iphonehide-innerblock header-top-playlist"><a class="iphone-extra" href="https://guld.moderskeppet.se/listor/">Spellistor</a></span>
            <span class="iphonehide-innerblock header-top-latest"><a class="resume iphone-extra" href="http://guld.moderskeppet.se/kurser/kurs/logotyper-i-illustrator/5_Text"><del>Senast sedda</del></a></span>
            <span class="iphonehide-innerblock header-top-watchlog"><a href="https://guld.moderskeppet.se/historik/">Historik</a></span>
            <span class="iphonehide-innerblock header-top-settings"><a href="https://guld.moderskeppet.se/profil/" title="Din Profil">Din profil</a></span>
             		//-->
			</div> 
          </div>

          <div class="header-body">
             <div class="header-body-inner wrap_nooverflow clearfix">


		 			<div class="kolumn3">
            <div id="logo">
		 				<a href="/"><img src="http://guld.moderskeppet.se/wp-content/themes/Guld-tema/library/gfx/logo.png" alt="Moderskeppet Guld - Videokurser för kreativa"></a>
					 </div>
          </div>

          <div id="iphoneknapp" class="iphone-extra">
              <a href="#">Meny <span class="icon-reorder"></span>
              </a>
          </div>

          <div class="main-nav iphonehide">
          <nav id="huvudmeny" class="kolumn6">
	           <div class="meny huvudmeny-container">

                    <a class="menu-item" href="http://guld.moderskeppet.se/">Hem</a>
                    <a class="menu-item" href="http://guld.moderskeppet.se/kunskap/">Kurser</a>
                    <a class="menu-item" href="http://guld.moderskeppet.se/om-oss/">Om oss</a>
                                          <a class="menu-item" href="http://guld.moderskeppet.se/bli-medlem/medlemskapet/">Medlemsinfo</a>
                                  </div>
           </nav>

           <nav id="secondarymeny" class="kolumn3">

            <div class="meny secondarymeny-container">
                    <a class="menu-item-blogg" href="http://guld.moderskeppet.se/bloggen/">Blogg</a>
                    <a class="menu-item-support" href="http://guld.moderskeppet.se/support/">Kontakt</a>
                      <a class="menu-item-login" href="https://guld.moderskeppet.se/wp-login.php?action=logout&amp;_wpnonce=a4bd134032">Logga ut</a>

             </div>

          </nav>

           </div> <!-- MAIN NAV -->

        </div></div> <!-- end header body -->

			</header> <!-- end header -->

		<div id="content-moderskeppet">

        <div id="inner-content"><!-- omfamnar även sidebar -->

		<div id="main" class="first clearfix fullsida" role="main">

<article>



	<main id="panel">
		<nav class="navbar navbar-default header" id="header-menu" component="navbar">
			<div class="container">
				<!-- IMPORT partials/menu.tpl -->
			</div>
		</nav>
		<div class="container" id="content">
		<!-- IMPORT partials/noscript/warning.tpl -->
