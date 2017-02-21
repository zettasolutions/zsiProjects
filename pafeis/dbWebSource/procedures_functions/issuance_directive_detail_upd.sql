
-- ===================================================================================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: November 10, 2016 6:47 PM
-- Description:	Issuance directive details insert and update records.
-- ===================================================================================================
-- Updated by	| Date		| Description
-- ===================================================================================================
-- Add your name, date, and description of your changes here. Thanks
-- ===================================================================================================

CREATE PROCEDURE [dbo].[issuance_directive_detail_upd]
(
    @tt    issuance_directive_detail_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  issuance_directive_id	= b.issuance_directive_id
		,item_id				= b.item_id
		,aircraft_id			= b.aircraft_id
		,unit_of_measure_id		= b.unit_of_measure_id
		,quantity				= b.quantity
		,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.issuance_directive_detail a INNER JOIN @tt b
    ON a.issuance_directive_detail_id = b.issuance_directive_detail_id
    WHERE (
			isnull(a.issuance_directive_id,0)	<> isnull(b.issuance_directive_id,0)  
		OR	isnull(a.item_id,0)					<> isnull(b.item_id,0)  
		OR	isnull(a.aircraft_id,0)				<> isnull(b.aircraft_id,0)  
		OR	isnull(a.unit_of_measure_id,0)		<> isnull(b.unit_of_measure_id,0)  
		OR	isnull(a.quantity,0)				<> isnull(b.quantity,0)  
	)
	   
-- Insert Process
    INSERT INTO dbo.issuance_directive_detail (
         issuance_directive_id 
		,item_id
		,aircraft_id
		,unit_of_measure_id
		,quantity
		,created_by
        ,created_date
        )
    SELECT 
        issuance_directive_id 
	   ,item_id
	   ,aircraft_id
	   ,unit_of_measure_id	
	   ,quantity
	   ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE issuance_directive_detail_id IS NULL;
END



