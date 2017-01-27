CREATE PROCEDURE [dbo].[item_class_upd]
(
    @tt    item_class_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  item_class_code		    = b.item_class_code
		,item_class_name			= b.item_class_name	   
		,is_active					= b.is_active
        ,updated_by					= @user_id
        ,updated_date				= GETDATE()
    FROM dbo.item_class a INNER JOIN @tt b
    ON a.item_class_id = b.item_class_id
    WHERE (
	        isnull(a.item_class_code,'')		<> isnull(b.item_class_code,'')  
		OR	isnull(a.item_class_name,'')		<> isnull(b.item_class_name,'')  
		OR	isnull(a.is_active,'')				<> isnull(b.is_active,'')  
	)
	   
-- Insert Process
    INSERT INTO dbo.item_class (
	     item_class_code 
		,item_class_name
		,is_active
        ,created_by
        ,created_date
        )
    SELECT 
	    item_class_code 
       ,item_class_name
	   ,is_active
	   ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE item_class_id IS NULL;
END



