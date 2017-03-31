
CREATE PROCEDURE [dbo].[item_types_upd]
(
    @tt    item_types_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  item_cat_id            = b.item_cat_id
	    ,item_type_code		    = b.item_type_code
		,item_type_name			= b.item_type_name
		,parent_item_type_id    = b.parent_item_type_id
		,is_active				= b.is_active
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.item_types a INNER JOIN @tt b
    ON a.item_type_id = b.item_type_id
    WHERE isnull(b.is_edited,'N')='Y'

-- Insert Process
    INSERT INTO dbo.item_types (
	     item_cat_id
        ,item_type_code 
		,item_type_name
		,parent_item_type_id
		,is_active
        ,created_by
        ,created_date
        )
    SELECT 
	    item_cat_id
       ,item_type_code 
	   ,item_type_name
	   ,parent_item_type_id	
	   ,is_active
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE item_type_id IS NULL
	and item_type_name IS NOT NULL;
END


