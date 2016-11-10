

-- ===================================================================================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: November 10, 2016 8:21 PM
-- Description:	Issuance details insert and update records.
-- ===================================================================================================
-- Updated by	| Date		| Description
-- ===================================================================================================
-- GOT            11-09-16    ADDED REMARKS/ITEM_ID IN WHERE CLAUSE.
-- ===================================================================================================

CREATE PROCEDURE [dbo].[issuance_details_upd]
(
    @tt    issuance_details_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  issuance_id			= b.issuance_id
		,item_id				= b.item_id
		,aircraft_id			= b.aircraft_id
		,unit_of_measure_id		= b.unit_of_measure_id
		,quantity				= b.quantity
		,remarks	            = b.remarks
		,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.issuance_details a INNER JOIN @tt b
    ON a.issuance_detail_id = b.issuance_detail_id
    WHERE (
			isnull(a.issuance_id,0)				<> isnull(b.issuance_id,0)  
		OR	isnull(a.item_id,0)					<> isnull(b.item_id,0)  
		OR	isnull(a.aircraft_id,0)				<> isnull(b.aircraft_id,0)  
		OR	isnull(a.unit_of_measure_id,0)		<> isnull(b.unit_of_measure_id,0)  
		OR	isnull(a.quantity,0)				<> isnull(b.quantity,0)  
		OR	isnull(a.remarks,'')				<> isnull(b.remarks,'')  
	)
	   
-- Insert Process
    INSERT INTO dbo.issuance_details (
         issuance_id 
		,item_id
		,aircraft_id
		,unit_of_measure_id
		,quantity
		,remarks
		,created_by
        ,created_date
        )
    SELECT 
        issuance_id 
	   ,item_id
	   ,aircraft_id
	   ,unit_of_measure_id	
	   ,quantity
	   ,remarks
	   ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE issuance_detail_id IS NULL
	  AND item_id IS NOT NULL;
END

