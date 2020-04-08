<?php // Do not delete these lines
if('comments.php' == basename($_SERVER['SCRIPT_FILENAME']))
	die('Ne pas télécharger cette page directement, merci !');
?>

<h2><div class='container'>Commentaires</div></h2>

<div class='container'>

	<?php
	if(!empty($post->post_password)){ // if there's a password
		if($_COOKIE['wp-postpass_' . COOKIEHASH] != $post->post_password){  // and it doesn't match the cookie ?>

			<p>Les commentaires sont protégés par mot de passe</p>
			<?php return;
		}
	}
	?>

	<?php if('open' == $post->comment_status) : ?>

		<h3 class='h4' id='commentform'>Réagir à cet article</h3>

		<?php if( get_option('comment_registration') && !$user_ID ) : ?>
			<p>Vous devez être <a href='<?php echo get_option('siteurl'); ?>/wp-login.php?redirect_to=<?php the_permalink(); ?>'>connecté</a> pour laisser un commentaire.</p>
		<?php else : ?>
			<?php if( $user_ID ){ ?>
				<p>Connecté en tant que
					<a href='<?php echo get_option('siteurl'); ?>/wp-admin/profile.php'><?php echo $user_identity; ?></a>. 
					<a href='<?php echo get_option('siteurl'); ?>/wp-login.php?action=logout'>Déconnection</a>
				</p>
			<?php } ?>

			<?php global $errorComment; if($errorComment){ ?>
				<p class='error'>
					<?php echo $errorComment; ?>
				</p>
			<?php } ?>

			<form action='<?php echo get_option('siteurl'); ?>/wp-comments-post.php' method='post' class='commentform'>
				
				<?php if( !$user_ID ) : ?>
					
					<fieldset>
						<label for='author' <?php if($req) echo "class='required'"; ?>>
							Votre nom
						</label><input type='text' name='author' id='author' value='<?php echo $comment_author; ?>' <?php if($req) echo 'required'; ?>>
						<span></span>
					</fieldset>
					<fieldset>
						<label for='email' <?php if($req) echo "class='required'"; ?>>
							Votre email
						</label><input type='email' name='email' id='email' value='<?php echo $comment_author_email; ?>' <?php if($req) echo 'required'; ?>>
						<span></span>
					</fieldset>
					<fieldset>
						<label for='url' <?php if($req) echo "class='required'"; ?>>
							Votre site
						</label><input type='url' name='url' id='url' value='<?php echo $comment_author_url; ?>' <?php if($req) echo 'required'; ?>>
						<span></span>
					</fieldset>					

				<?php endif; ?>
				
				<fieldset>
					<label for='comment' <?php if($req) echo "class='required'"; ?>>
						Votre commentaire
					</label><textarea name='comment' id='comment' <?php if($req) echo 'required'; ?>></textarea>
					<span></span>
				</fieldset>
				
				<button name='submit' type='submit' class='btn btn-right'>Envoyer</button>
				<input type='hidden' name='comment_post_ID' value='<?php echo $id; ?>'/>

				<?php do_action('comment_form', $post->ID); ?>

			</form>

		<?php endif; // If registration required and not logged in ?>

	<?php endif; // if you delete this the sky will fall on your head ?>

	<?php if($comments) : ?>
		<h3 class='h4' id='comments'>
			<?php comments_number('Pas de commentaire', 'Un brillant commentaire', '% brillants commentaires' );?> pour cet article
		</h3>

		<ul class='commentlist'>
			<?php foreach($comments as $comment) : ?>

				<li id='comment-<?php comment_ID(); ?>'>
					
					<div class='img'>
						<?php echo get_avatar( $comment, 62, '', $comment->comment_author ); ?>
					</div><div class='content'>
						<p class='commentmeta'>
							<?php $author = $comment->comment_author_url ? "<a href='". $comment->comment_author_url ."' target='_blank'>". $comment->comment_author ."</a></strong>" : $comment->comment_author; ?>
							<strong><?php echo $author; ?></strong>,
							le <?php comment_date('j F Y') ?>, a écrit:
							<i><?php edit_comment_link('Edit Comment', '', ''); ?></i>
			 				<?php if($comment->comment_approved == '0') : ?>
								<i>Votre commentaire est en cours de modération</i>
			 				<?php endif; ?>
						</p>
						<?php comment_text() ?>
					</div>
				</li>

			<?php endforeach; ?>
		</ul>

	<?php else : // this is displayed if there are no comments so far ?>

		<?php if('open' != $post->comment_status) : ?>
			<!-- If comments are closed. -->
			<p class="nocomments">Les commentaires sont fermés !</p>
		<?php endif; ?>

	<?php endif; ?>

</div>