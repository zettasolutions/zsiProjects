/****** Object:  StoredProcedure [dbo].[receiving_details_upd]    Script Date: 12/19/2016 11:59:40 AM ******/
CREATE PROCEDURE [dbo].[receiving_details_upd]
(
    @tt    receiving_details_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  item_code_id			= b.item_code_id
		,serial_no				= b.serial_no
		,unit_of_measure_id		= b.unit_of_measure_id
		,quantity				= b.quantity
		,item_class_id			= b.item_class_id
		,remarks	            = b.remarks
		,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.receiving_details a INNER JOIN @tt b
    ON a.receiving_detail_id = b.receiving_detail_id
    WHERE (
		isnull(a.item_code_id,0)			<> isnull(b.item_code_id,0)  
		OR	isnull(a.serial_no,0)		    <> isnull(b.serial_no,0)  
		OR	isnull(a.unit_of_measure_id,0)	<> isnull(b.unit_of_measure_id,0)  
		OR	isnull(a.quantity,0)			<> isnull(b.quantity,0)  
		OR	isnull(a.item_class_id,0)		<> isnull(b.item_class_id,0)  
		OR	isnull(a.remarks,'')			<> isnull(b.remarks,'')  
	)
	   
-- Insert Process
    INSERT INTO dbo.receiving_details (
         receiving_id 
		,item_code_id
		,serial_no
		,unit_of_measure_id
		,quantity
		,item_class_id
		,remarks
		,created_by
        ,created_date
        )
    SELECT 
        receiving_id 
	   ,item_code_id
	   ,serial_no
	   ,unit_of_measure_id	
	   ,quantity
	   ,item_class_id
	   ,remarks
	   ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE receiving_detail_id IS NULL
	  AND receiving_id IS NOT NULL
	  AND item_code_id IS NOT NULL
END


