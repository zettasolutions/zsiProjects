

CREATE PROCEDURE [dbo].[device_batch_upd](
    @tt   device_batch_tt READONLY
   ,@user_id int
 
)
as 

	-- Update Process
	UPDATE a 
		   SET 
	   			batch_no			= b.batch_no		
			   ,batch_qty			= b.batch_qty		
			   ,received_date		= b.received_date	
			   ,received_by			= b.received_by		
			   ,status_id			= b.status_id		
			   ,invoice_no			= b.invoice_no		
			   ,invoice_date		= b.invoice_date	
			   ,dr_no				= b.dr_no			
			   ,supplier_id			= b.supplier_id		
			   ,updated_by			= @user_id
			   ,updated_date		= DATEADD(HOUR, 8, GETUTCDATE())

       FROM dbo.device_batch a INNER JOIN @tt b
	     ON a.batch_id = b.batch_id 
	    AND (isnull(is_edited,'N')='Y')

-- Insert Process
	INSERT INTO device_batch (
          batch_no
		 ,batch_qty
		 ,received_date
		 ,received_by
		 ,status_id
		 ,invoice_no
		 ,invoice_date
		 ,dr_no
		 ,supplier_id
		 ,created_by
		 ,created_date
		
    )
	SELECT 
		 batch_no
		,batch_qty
		,received_date
		,received_by
		,status_id
		,invoice_no
		,invoice_date
		,dr_no
	    ,supplier_id
		,@user_id
		,DATEADD(HOUR, 8, GETUTCDATE())

	FROM @tt 
	WHERE batch_id IS NULL
      AND batch_no IS NOT NULL; 












	 
