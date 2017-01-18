<form role="search" method="get" class="searchform" id="searchform" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<input type="search" name="s" id="searchInput" value="<?php the_search_query(); ?>" placeholder="Rechercher" />
	<input type="submit" id="search" value="Go"/>
</form>