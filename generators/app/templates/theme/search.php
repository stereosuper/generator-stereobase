<?php get_header(); ?>

	<?php if ( have_posts() ) : 
	global $wp_query;
	$results = $wp_query->found_posts; ?>

		<h1>La recherche "<?php the_search_query(); ?>" a retourné <?php if($results > 1){ echo $results . ' résultats'; }else{ echo '1 résultat'; } ?> </h1>

		<?php while ( have_posts() ) : the_post(); ?>

			<h2><?php the_title(); ?></h2>
			<?php the_excerpt(); ?>
		
		<?php endwhile; ?>

			<?php previous_posts_link('Résultats plus récents'); ?>
			<?php next_posts_link('Résultats plus anciens'); ?>
	
	<?php else : ?>
				
		<h1>La recherche "<?php the_search_query(); ?>" n'a retourné aucun résultat</h1>

	<?php endif; ?>

<?php get_footer(); ?>