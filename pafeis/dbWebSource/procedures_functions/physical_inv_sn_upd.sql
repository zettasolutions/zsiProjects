
CREATE PROCEDURE [dbo].[physical_inv_sn_upd]
(
    @tt    physical_inv_sn_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  physical_inv_id        = b.physical_inv_id
	    ,item_code_id			= b.item_code_id
		,serial_no				= b.serial_no
		,status_id				= b.status_id
		,remaining_time         = b.remaining_time
		,no_repairs             = b.no_repairs
		,no_overhauls           = b.no_overhauls
		,remarks                = b.remarks
		,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.physical_inv_sn a INNER JOIN @tt b
    ON a.physical_inv_sn_id = b.physical_inv_sn_id
    WHERE ISNULL(b.is_edited,'N')='Y'
  
-- Insert Process
    INSERT INTO dbo.physical_inv_sn (
         physical_inv_id 	
	    ,item_code_id
		,serial_no
		,status_id
		,remaining_time
		,no_repairs
		,no_overhauls
		,remarks
		,created_by
        ,created_date
        )
    SELECT 
         physical_inv_id 	
	    ,item_code_id
		,serial_no
		,status_id
		,remaining_time
		,no_repairs
		,no_overhauls
	    ,remarks
	    ,@user_id
        ,GETDATE()
    FROM @tt
    WHERE physical_inv_sn_id IS NULL
	  AND physical_inv_id IS NOT NULL
	  AND item_code_id IS NOT NULL
	  AND serial_no IS NOT NULL
END



