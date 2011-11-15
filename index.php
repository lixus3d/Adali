<?php

$js = array(
	/*
	 * Bases
	 */
	'jquery',
	'base',
	'common',
	'binaryHeaps',
	/*
	 * RTS base
	 */
	'RTS',
	'RTS.utils',
	/*
	 * Interfaces
	 */
	'interfaces/itemInterface',
	/*
	 * Abstracts
	 */
	'abstracts/itemAbstract',
	/*
	 * Motor
	 */

	'node',
	'map',
	'path',
	'pathfinder',
	'units',
	'unit',
	'unitType',
	'weapon',
	'weaponType',
	'buildings',
	'building',
	'buildingType',
	'projectile',
	'team',
	'teams',
	'buildQueue',
	'ressources',
	'selection',
	'sounds',
	'menu',
	'motor',
	'unitTesting',
);
?>
<!DOCTYPE HTML>
<html>
    <head>
        <link href="./css/styles.css"  rel="stylesheet"  type="text/css"  media="all" />
        <link href="./css/units.css"  rel="stylesheet"  type="text/css"  media="all" />
		<?
		foreach ($js as $name) {
			echo '<script type="text/javascript" src="./js/' . $name . '.js"></script>' . "\n";
		}
		?>
    </head>
    <body>
		<!--        <div class="action">
		    <a href="#startEngine">Start</a>
		    <a href="#stopEngine">Stop</a>
		    <a href="#construct" rel="tank" >Construct tank</a>
		    <a href="#construct" rel="heavyTank" >Construct heavyTank</a>
		</div>-->

        <div class="interface">

            <div class="selector"></div>
            <div class="messages"></div>

            <div class="map">
                <div class="walls"></div>
                <div class="grid"></div>
            </div>

            <div class="units"></div>
            <div class="buildings"></div>
            <div class="projectiles"></div>

			<!-- MENU -->
			<div class="menu">

				<div class="block credit">
					<div class="picto credit"></div>
					<div class="sold">0</div>
				</div>

				<div class="block miniMap">
					<div class="picto wmap"></div>
					<div class="cameraSight"></div>
					<div class="satellite">
						<div class="points"></div>
						<div class="terrain"></div>
					</div>
				</div>

				<div class="powerJauge low">
					<div class="picto power"></div>
					<div class="mask"></div>
					<div class="producing rB10"></div>
					<div class="draining rB10"></div>
				</div>

				<!-- CONSTRUCTION -->
				<div class="construction">

					<!-- BUILDING LIST -->
					<div class="list rB10 listBuilding">
						<div class="subMenu rB8">
							<ul>
								<li><a href="#buildings-tab">buildings</a></li>
								<li><a href="#experimentals-tab">experimentals</a></li>
							</ul>
						</div>
					</div>

					<!-- UNIT LIST -->
					<div class="list rB10 listUnit">
						<div class="subMenu rB8">
							<ul>
								<li><a href="#infantry-tab">infantry</a></li>
								<li><a href="#vehicules-tab">vehicules</a></li>
								<li><a href="#aerials-tab">aerials</a></li>
							</ul>
						</div>
					</div>

					<!-- DEFENSE LIST -->
					<div class="list rB10 listDefense">
						<div class="subMenu rB8">
							<ul>
								<li><a href="#defense-tab">defense</a></li>
								<li><a href="#special-tab">special</a></li>
							</ul>
						</div>
					</div>

				</div>
				<!-- Construction end -->

			</div>
			<!-- MENU end -->
        </div>



        <div class="openList"></div>
        <div class="closeList"></div>

    </body>
    <script type="text/javascript" src="./js/init.js"></script>
</html>