CREATE PROCEDURE [dbo].[receiving_details_upd]
(
    @tt    receiving_details_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  receiving_id			= b.receiving_id
		,item_id				= b.item_id
		,serial_no				= b.serial_no
		,unit_of_measure_id		= b.unit_of_measure_id
		,quantity				= b.quantity
		,remarks	            = b.remarks
		,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.receiving_details a INNER JOIN @tt b
    ON a.receiving_detail_id = b.receiving_detail_id
    WHERE (
			isnull(a.receiving_id,0)		<> isnull(b.receiving_id,0)  
		OR	isnull(a.item_id,0)				<> isnull(b.item_id,0)  
		OR	isnull(a.serial_no,0)		    <> isnull(b.serial_no,0)  
		OR	isnull(a.unit_of_measure_id,0)	<> isnull(b.unit_of_measure_id,0)  
		OR	isnull(a.quantity,0)			<> isnull(b.quantity,0)  
		OR	isnull(a.remarks,'')			<> isnull(b.remarks,'')  
	)
	   
-- Insert Process
    INSERT INTO dbo.receiving_details (
         receiving_id 
		,item_id
		,serial_no
		,unit_of_measure_id
		,quantity
		,remarks
		,created_by
        ,created_date
        )
    SELECT 
        receiving_id 
	   ,item_id
	   ,serial_no
	   ,unit_of_measure_id	
	   ,quantity
	   ,remarks
	   ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE receiving_detail_id IS NULL
	  AND item_id IS NOT NULL;
END

