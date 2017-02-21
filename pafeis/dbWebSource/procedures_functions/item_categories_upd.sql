CREATE PROCEDURE [dbo].[item_categories_upd]
(
    @tt    item_categories_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  item_cat_code		    = b.item_cat_code
		,item_cat_name			= b.item_cat_name
		,parent_item_cat_id     = b.parent_item_cat_id
		,is_active				= b.is_active
		,with_serial			= b.with_serial
		,seq_no                 = b.seq_no
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.item_categories a INNER JOIN @tt b
    ON a.item_cat_id = b.item_cat_id
    WHERE isnull(b.is_edited,'N') = 'Y'
	   
-- Insert Process
    INSERT INTO dbo.item_categories (
         item_cat_code 
		,item_cat_name
		,is_active
		,with_serial
		,seq_no
        ,created_by
        ,created_date
        )
    SELECT 
        item_cat_code 
	   ,item_cat_name	
	   ,is_active
	   ,with_serial
	   ,seq_no
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE item_cat_id IS NULL
	  AND item_cat_name IS NOT NULL;
END




