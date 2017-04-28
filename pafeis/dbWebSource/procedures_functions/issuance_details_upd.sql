




-- ===================================================================================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: November 10, 2016 8:21 PM
-- Description:	Issuance details insert and update records.
-- ===================================================================================================
-- Updated by	| Date		| Description
-- ===================================================================================================
-- GOT            11-09-16    ADDED REMARKS/ITEM_ID IN WHERE CLAUSE.
-- ===================================================================================================

create PROCEDURE [dbo].[issuance_details_upd]
(
    @tt    issuance_details_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  item_inv_id           = b.item_inv_id
		,serial_no				= b.serial_no
		,quantity				= b.quantity
		,remarks	            = b.remarks
		,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.issuance_details a INNER JOIN @tt b
    ON a.issuance_detail_id = b.issuance_detail_id
    WHERE ISNULL(b.is_edited,'N')='Y' and isnull(b.item_inv_id,0) <> 0 ;

-- Insert Process
    INSERT INTO dbo.issuance_details (
         issuance_id
		,item_inv_id 
		,serial_no
		,quantity
		,remarks
		,created_by
        ,created_date
        )
    SELECT 
        issuance_id 
	   ,item_inv_id
	   ,serial_no
	   ,quantity
	   ,remarks
	   ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE issuance_detail_id IS NULL 
	  AND issuance_id IS NOT NULL
	  AND item_inv_id IS NOT NULL;
END




