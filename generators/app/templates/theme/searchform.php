<form role='search' method='get' action='<?php echo esc_url( home_url( '/' ) ); ?>'>
	<input type='search' name='s' value='<?php the_search_query(); ?>'>
	<input type='submit' id='search' value='Go'>
</form>