CREATE PROCEDURE [dbo].[item_codes_upd]
(
    @tt    item_codes_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  item_type_id		    = b.item_type_id
		,part_no  			    = b.part_no
		,national_stock_no		= b.national_stock_no
		,item_name				= b.item_name
		,critical_level         = b.critical_level
		,reorder_level          = b.reorder_level
		,unit_of_measure_id     = b.unit_of_measure_id
		,monitoring_type_id     = b.monitoring_type_id
		,is_active				= b.is_active
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.item_codes a INNER JOIN @tt b
    ON a.item_code_id = b.item_code_id
    WHERE isnull(b.is_edited,'N')='Y'
	   
-- Insert Process
    INSERT INTO dbo.item_codes (
	     item_cat_id
        ,item_type_id 
		,part_no
		,national_stock_no
		,item_name
		,critical_level
		,reorder_level
		,unit_of_measure_id
		,monitoring_type_id
		,is_active
        ,created_by
        ,created_date
        )
    SELECT 
	    item_cat_id
       ,item_type_id 
	   ,part_no	
	   ,national_stock_no
	   ,item_name
	   ,critical_level
	   ,reorder_level
	   ,unit_of_measure_id
	   ,monitoring_type_id
	   ,is_active
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE item_code_id IS NULL;
END



