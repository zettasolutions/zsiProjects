CREATE procedure [dbo].[page_templates_sel]
	 @pt_id int =null
	,@page_name varchar(50) =null
	,@pt_content varchar(max)=null
	,@self_backup int=null
	,@user_id	int 
as
BEGIN

  IF NOT @self_backup IS NULL
	BEGIN 	
		select a.*,b.page_name,b.page_title from dbo.page_templates a inner join dbo.pages b on a.page_id=b.page_id
		WHERE a.updated_by= @user_id and not b.page_name like '%test%' 
		
			OR (a.created_by= @user_id and a.updated_by is null and not b.page_name like '%test%')
		RETURN; 
	END

	if(@pt_id IS NOT NULL)
		select a.*,b.page_name from dbo.page_templates a left join dbo.pages b on a.page_id=b.page_id where pt_id=@pt_id
	else
		BEGIN			
			if(@page_name IS NOT NULL)		 
					select top 1 p.page_name,p.page_title,p.page_id, pt.* from dbo.pages p
					left join  dbo.page_templates pt on pt.page_id = p.page_id
					 where lower(p.page_name) =lower(@page_name)
			ELSE
				BEGIN
					if(@pt_content is not null)
						select a.*,b.page_name from dbo.page_templates a left join dbo.pages b on a.page_id=b.page_id where pt_content like concat('%', @pt_content, '%')
					ELSE
						select a.*,b.page_name,b.page_title from dbo.page_templates a left join dbo.pages b on a.page_id=b.page_id;
				END
		END
END
 

 



