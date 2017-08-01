<?php

global $wp_query;

if($post->post_parent){
    wp_redirect( get_permalink( $post->post_parent ) );
}else{
    $wp_query->set_404();
    status_header( 404 );
    get_template_part( 404 );
}

exit;

?>
