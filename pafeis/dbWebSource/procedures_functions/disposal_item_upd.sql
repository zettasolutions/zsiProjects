

CREATE PROCEDURE [dbo].[disposal_item_upd]
(
    @tt    disposal_item_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  item_id				= b.item_id
		,unit_of_measure_id		= b.unit_of_measure_id
		,quantity				= b.quantity
		,authority_ref			= b.authority_ref
		,remarks				= b.remarks
		,status_id				= b.status_id
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.disposal_item a INNER JOIN @tt b
    ON a.disposal_item_id = b.disposal_item_id
    WHERE (
			isnull(a.item_id,0)				<> isnull(b.item_id,0)  
		OR	isnull(a.unit_of_measure_id,0)	<> isnull(b.unit_of_measure_id,0)  
		OR	isnull(a.quantity,0)			<> isnull(b.quantity,0)  
		OR	isnull(a.authority_ref,'')		<> isnull(b.authority_ref,'')  
		OR	isnull(a.remarks,'')			<> isnull(b.remarks,'')  
		OR	isnull(a.status_id,0)			<> isnull(b.status_id,0)  
	)
	   
-- Insert Process
    INSERT INTO dbo.disposal_item (
         item_id
		,unit_of_measure_id
		,quantity
		,authority_ref
		,remarks
		,status_id
        ,disposed_by
        ,disposed_date
        )
    SELECT 
        item_id	
	   ,unit_of_measure_id
	   ,quantity
	   ,authority_ref
	   ,remarks
	   ,status_id
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE disposal_item_id IS NULL;
END


