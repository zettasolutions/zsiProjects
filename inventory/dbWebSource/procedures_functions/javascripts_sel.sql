CREATE procedure [dbo].[javascripts_sel] 
	 @js_id int =null
	,@page_name varchar(50) =null
	,@js_content varchar(50) =null
	,@self_backup int=null
	,@user_id int

as
begin
  DECLARE @stmt AS VARCHAR(1000);
 
  SET @stmt = 'select a.*,b.page_name from dbo.javascripts a left join dbo.pages b on a.page_id=b.page_id where 1=1 ';
  
  IF ISNULL(@js_id,0) <> 0
     SET @stmt = @stmt + ' AND a.js_id = ' +  CAST(@js_id AS VARCHAR);

  IF ISNULL(@page_name,'') <> ''
     SET @stmt = @stmt + ' AND lower(b.page_name) = ''' + CAST(lower(@page_name) AS VARCHAR(50)) +  '''';

--     SET @stmt = @stmt + ' AND lower(b.page_name) like ''' + CONCAT('%', lower(@page_name),'%') +  '''';

  IF ISNULL(@js_content,'') <> ''
     SET @stmt = @stmt + ' AND js_content like ''' + CONCAT('%', @js_content,'%') + '''';


  IF NOT @self_backup IS NULL 
	BEGIN
		 
     SET @stmt = @stmt + ' AND a.updated_by=' + CONVERT(varchar(50),@user_id) + ' and not b.page_name like ''%test%'' '
	 SET @stmt = @stmt + ' OR (a.created_by= ' + CONVERT(varchar(50), @user_id) + ' and a.updated_by is null and not b.page_name like ''%test%'')'
	END

     SET @stmt = @stmt + ' order by b.page_name';
  EXEC (@stmt);

END




