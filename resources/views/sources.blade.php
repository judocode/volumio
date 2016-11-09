@extends('layouts.master')

@section('content')
<div class="container credits">
	<h1>DB sources</h1>
	<form>
		<p><button class="btn btn-lg btn-primary" type="submit" name="updatempd" value="1" id="updatempddb"><i class="fa fa-refresh sx"></i>Update Library</button></p>
	</form>
	<div class="tile text-left">
		<p>Volumio creates and updates its music database via the following source directories:</p>
		<ul>
			<li><strong>NAS</strong><br><span class="help-block">This section contains all your connected network shares. (SAMBA/NFS etc.)</span></li>
			<li><strong>USB</strong><br><span class="help-block">Locally connected external USB drives. (FAT32 or NTFS)</span></li>
			<li><strong>RAM</strong><br><span class="help-block">The content of the RAMdisk, upload your files here and enjoy RamPlay Heaven.</span></li>
		</ul>
	</div>

	<h2>NAS mounts</h2>
	<p>List of configured network mounts (click to edit)</p>
	<form method="post">
		$_mounts
		<p><a href="sources.php?p=add" class="btn btn-lg btn-primary btn-block" data-ajax="false"><i class="fa fa-plus sx"></i> Add new mount</a></p>
	</form>
</div>
@endsection
