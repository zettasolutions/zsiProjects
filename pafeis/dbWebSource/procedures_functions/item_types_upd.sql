
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
	    ,monitoring_type_id     = b.monitoring_type_id
	    ,item_type_code		    = b.item_type_code
		,item_type_name			= b.item_type_name
	    ,unit_of_measure_id     = b.unit_of_measure_id
		,is_active				= b.is_active
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.item_types a INNER JOIN @tt b
    ON a.item_type_id = b.item_type_id
    WHERE (
	        isnull(a.item_cat_id,0)			<> isnull(b.item_cat_id,0) 
		OR	isnull(a.monitoring_type_id,0)	<> isnull(b.monitoring_type_id,0) 
		OR	isnull(a.unit_of_measure_id,0)	<> isnull(b.unit_of_measure_id,0) 
		OR	isnull(a.item_type_code,'')		<> isnull(b.item_type_code,'')  
		OR	isnull(a.item_type_name,'')		<> isnull(b.item_type_name,'')  
		OR	isnull(a.is_active,'')			<> isnull(b.is_active,'')  
	)
	   
-- Insert Process
    INSERT INTO dbo.item_types (
	     item_cat_id
		,monitoring_type_id
        ,item_type_code 
		,item_type_name
		,unit_of_measure_id
		,is_active
        ,created_by
        ,created_date
        )
    SELECT 
	    item_cat_id
	   ,monitoring_type_id
       ,item_type_code 
	   ,item_type_name	
	   ,unit_of_measure_id
	   ,is_active
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE item_type_id IS NULL;
END


