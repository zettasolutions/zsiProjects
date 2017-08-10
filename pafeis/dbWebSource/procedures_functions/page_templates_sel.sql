CREATE procedure [dbo].[page_templates_sel]
	 @pt_id int =null
	,@page_name varchar(50) =null
	,@pt_content varchar(max)=null
	,@self_backup int=null
	,@user_id	int 
	,@is_list VARCHAR(1)='N'
as
BEGIN
  SET NOCOUNT ON
  DECLARE @stmt NVARCHAR(MAX) = '';
  SET @stmt = 'select a.*,b.page_name,b.page_title,dbo.getUser(a.created_by) as created_by_name,dbo.getUser(a.updated_by) as updated_by_name from dbo.page_templates a left join dbo.pages b on a.page_id=b.page_id WHERE 1=1 '

  IF NOT @self_backup IS NULL
	 BEGIN 	
		select a.*,b.page_name,b.page_title from dbo.page_templates a inner join dbo.pages b on a.page_id=b.page_id
		WHERE a.updated_by= @user_id and not b.page_name like '%test%' 		
			OR (a.created_by= @user_id and a.updated_by is null and not b.page_name like '%test%')
		RETURN; 
	 END
	
  IF(@page_name IS NOT NULL AND @is_list='N' )		 
		BEGIN
			select top 1 p.page_name,p.page_title,p.page_id, pt.* from dbo.pages p
			left join  dbo.page_templates pt on pt.page_id = p.page_id
				where lower(p.page_name) =lower(@page_name)
			RETURN;
		END 

  IF(@pt_id IS NOT NULL) 
		SET @stmt = @stmt + ' AND a.pt_id =' +  CAST(@pt_id AS VARCHAR(20))
  IF(@page_name IS NOT NULL) 
		SET @stmt = @stmt + ' AND b.page_name like ''%' + @page_name + '%'''  
  IF(@pt_content IS NOT NULL) 
		SET @stmt = @stmt + ' AND a.pt_content like ''%' + @pt_content + '%'''  
 
  EXEC(@stmt);

END
 

 





