<?php get_header(); ?>

<article class='container'>

	<?php if ( have_posts() ) : the_post(); ?>

		<h1><?php the_title(); ?></h1>
		<time><?php echo get_the_date(); ?></time>

		<?php the_content(); ?>

	<?php else : ?>
				
		<h1>404</h1>

	<?php endif; ?>

</article>

<?php get_footer(); ?>
