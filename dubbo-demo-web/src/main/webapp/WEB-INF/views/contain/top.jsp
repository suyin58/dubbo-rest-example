<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<div class="h-header h-header-collapsed" region="north">

	#if($frame.logo)
	<div class="h-logo"  $horn.paramsCache($frame.logo)>
					#if($frame.logo.img)
					<img src="$!{frame.logo.img}" height="50"/>
					#end
					<span>${frame.logo.title}</span>
	</div>
	#end
	#if($frame.toolbar)
	<div class="h-toolbar"  $horn.paramsCache($frame.toolbar)>
		<a href="#"><i class="h-i-user"></i><span>用户中心</span><b class="h-caret"></b></a>
    	<ul>
			#foreach($toolbarItem in $frame.toolbar.items)
				<li>
					<a #if($toolbarItem.url)href="$!{toolbarItem.url}" #else href="javascript:void(0)" #end #if($toolbarItem.onclick) onclick="$toolbarItem.onclick" #end title="$!{toolbarItem.title}">#if($toolbarItem.icon)<i class="h-i-$!{toolbarItem.icon}"></i>#end<span>${toolbarItem.title}</span>#if($toolbarItem.num)<span class="h-number">$!{toolbarItem.num}</span>#end#if($toolbarItem.items)<b class="h-caret"></b>#end</a>
					#if($toolbarItem.items)
					<ol>
						#foreach($toolbarSubItem in $toolbarItem.items)
							<li><a #if($toolbarSubItem.url)href="$!{toolbarSubItem.url}" #else href="javascript:void(0)" #end  #if($toolbarSubItem.onclick) onclick="$toolbarSubItem.onclick" #end title="$!{toolbarSubItem.title}">$!{toolbarSubItem.title}</a></li>
						#end
					</ol>
					#end
				</li>
			#end
        </ul>
    </div>
	#end
	#if($frame.navigation)
	<div class="h-nav" $horn.paramsCache($frame.navigation) style="padding-top:0">
        <div class="h-nav-con" style="position: fixed;width: 100%;height:50px">
			#if($frame.navigation.items)
        	<ul>
				#foreach($navigationItem in $frame.navigation.items)
					<li>
						<a  onclick="Horn.Frame.openMenu('$!{navigationItem.id}','$!{navigationItem.url}','$!{navigationItem.title}','$!{navigationItem.icon}')"><i class="h-i-$!{navigationItem.icon}"></i><span display="block">${navigationItem.title}</span></a>
						<span class="h-tab-close" style="display:none;"></span>
					</li>
				#end
            </ul>
			#end
        </div>
        <div class="h-nav-next"  style="display:none;"><i></i></div>
    </div>	
	#end

</div>