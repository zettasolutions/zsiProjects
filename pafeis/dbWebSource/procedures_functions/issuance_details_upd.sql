

CREATE PROCEDURE [dbo].[issuance_details_upd]
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
		,item_status_id         = b.item_status_id
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
		,item_status_id
		,remarks
		,created_by
        ,created_date
        )
    SELECT 
        issuance_id 
	   ,item_inv_id
	   ,serial_no
	   ,quantity
	   ,item_status_id
	   ,remarks
	   ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE issuance_detail_id IS NULL 
	  AND issuance_id IS NOT NULL
	  AND item_inv_id IS NOT NULL;
END





