<?php get_header(); ?>

<div class='container'>

	<?php if ( have_posts() ) : 
	global $wp_query;
	$results = $wp_query->found_posts;
	$results = $results > 1 ? $results . ' results' : $results . ' result';
	?>

		<h1><?php echo __('The search for') . ' "' . the_search_query() .'" ' . __('returned') . $results; ?></h1>

		<?php while ( have_posts() ) : the_post(); ?>

			<h2><?php the_title(); ?></h2>
			<?php the_excerpt(); ?>
		
		<?php endwhile; ?>

			<?php previous_posts_link('Résultats plus récents'); ?>
			<?php next_posts_link('Résultats plus anciens'); ?>
	
	<?php else : ?>
				
	<h1><?php echo __('The search for') . ' "' . the_search_query() .'" ' . __("didn't return any results"); ?></h1>

	<?php endif; ?>

</div>

<?php get_footer(); ?>