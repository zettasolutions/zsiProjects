



create PROCEDURE [dbo].[categories_upd]
(
    @tt    categories_tt READONLY
   ,@user_id int
)
AS

BEGIN
SET NOCOUNT ON
DECLARE @client_id int
-- Update Process
    UPDATE a 
    SET  category_desc			= b.category_desc
		,is_active				= b.is_active
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.categories a INNER JOIN @tt b
    ON a.category_id = b.category_id
    WHERE isnull(b.is_edited,'N') = 'Y' ;

	   
-- Insert Process
    SELECT @client_id=client_id FROM dbo.users where user_id=@user_id;
    INSERT INTO dbo.categories (
         category_desc
		,client_id    
	    ,is_active
        ,created_by
        ,created_date
        )
    SELECT 
		category_desc
       ,@client_id 
	   ,is_active 
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE category_id IS NULL
	and category_desc IS NOT NULL;
END







