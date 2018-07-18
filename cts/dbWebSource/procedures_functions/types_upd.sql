



create PROCEDURE [dbo].[types_upd]
(
    @tt    types_tt READONLY
   ,@user_id int
)
AS

BEGIN
SET NOCOUNT ON
DECLARE @client_id int
-- Update Process
    UPDATE a 
    SET  type_desc			    = b.type_desc
	    ,category_id            = b.category_id
		,is_active				= b.is_active
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.types a INNER JOIN @tt b
    ON a.type_id = b.type_id
    WHERE isnull(b.is_edited,'N') = 'Y' ;

	   
-- Insert Process
    SELECT @client_id=client_id FROM dbo.users where user_id=@user_id;
    INSERT INTO dbo.types (
         type_desc
		,client_id 
		,category_id   
	    ,is_active
        ,created_by
        ,created_date
        )
    SELECT 
		type_desc
       ,@client_id 
	   ,category_id
	   ,is_active 
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE type_id IS NULL
	and type_desc IS NOT NULL;
END







