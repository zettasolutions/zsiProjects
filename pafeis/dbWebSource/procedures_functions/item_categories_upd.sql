
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
		,is_active				= b.is_active
		,seq_no                 = b.seq_no
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.item_categories a INNER JOIN @tt b
    ON a.item_cat_id = b.item_cat_id
    WHERE (
			isnull(a.item_cat_code,'')		<> isnull(b.item_cat_code,'')  
		OR	isnull(a.item_cat_name,'')		<> isnull(b.item_cat_name,'')  
		OR	isnull(a.is_active,'')			<> isnull(b.is_active,'')  
		OR	isnull(a.seq_no,0)			    <> isnull(b.seq_no,0) 
	)
	   
-- Insert Process
    INSERT INTO dbo.item_categories (
         item_cat_code 
		,item_cat_name
		,is_active
		,seq_no
        ,created_by
        ,created_date
        )
    SELECT 
        item_cat_code 
	   ,item_cat_name	
	   ,is_active
	   ,seq_no
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE item_cat_id IS NULL;
END


