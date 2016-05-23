<div class="account-new">
<div class="profile-wrap">
	<!-- IMPORT partials/account/header.tpl -->
</div>
	<div class="row">
		<h1>{title}</h1>

		<!-- IF !posts.length -->
			<div class="alert alert-warning text-center">{noItemsFoundKey}</div>
		<!-- ENDIF !posts.length -->

		<div class="col-xs-12">
			<!-- IMPORT partials/posts_list.tpl -->

			<!-- IF config.usePagination -->
				<!-- IMPORT partials/paginator.tpl -->
			<!-- ENDIF config.usePagination -->
		</div>
	</div>
</div>