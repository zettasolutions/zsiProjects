CREATE PROCEDURE [dbo].[page_templates_upd](
        @pt_id		INT =null                      
       ,@page_id	INT	= NULL   
       ,@pt_content	VARCHAR(max)= NULL
	   ,@user_id	INT    
	   ,@new_id		INT OUTPUT 

)
AS 
BEGIN
SET NOCOUNT ON 
	if(@page_id is null) return;

	if(isnull(@pt_id,0)=0 )
		begin
			INSERT INTO dbo.page_templates( page_id,pt_content,created_by,created_date) 
			VALUES (@page_id, @pt_content,@user_id, GETDATE())
			set @new_id	=@@identity
		end
	else
		set @new_id=@pt_id
		begin
			UPDATE dbo.page_templates 
			SET 
			  page_id=@page_id
			, pt_content=@pt_content 
			, updated_by =  @user_id
			, updated_date = GETDATE()
			where pt_id=@pt_id
		end	  
	
END 





