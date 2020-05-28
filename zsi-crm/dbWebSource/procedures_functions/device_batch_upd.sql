

CREATE PROCEDURE [dbo].[device_batch_upd](
   @batch_id		int=null
  ,@batch_qty		int=null
  ,@received_date	date=null
  ,@user_id			int=null
  ,@received_by		int=null
  ,@invoice_no		nvarchar(20)=null
  ,@invoice_date	date=null
  ,@dr_no			nvarchar(20)=null
  ,@supplier_id		int=null
  ,@status_id		int=null
  ,@id				INT=NULL OUTPUT 
 
)
as
BEGIN
   SET NOCOUNT ON
   SET @id = @batch_id
	 IF ISNULL(@batch_id,0)=0
	 BEGIN
		INSERT INTO dbo.device_batch
		 (
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
		 ) VALUES
		 (
		  @id
		 ,@batch_qty
		 ,@received_date
		 ,@received_by
		 ,@status_id
		 ,@invoice_no
		 ,@invoice_date
		 ,@dr_no
		 ,@supplier_id
		 ,@user_id
		 ,GETDATE()
		 ) 
		SET @id = @@IDENTITY
	END
	ELSE
	   UPDATE dbo.device_batch SET
			    batch_no			= @id
			   ,batch_qty			= @batch_qty
			   ,received_date		= @received_date
			   ,received_by			= @received_by
			   ,status_id			= @status_id
			   ,invoice_no			= @invoice_no
			   ,invoice_date		= @invoice_date
			   ,dr_no				= @dr_no
			   ,supplier_id			= @supplier_id
			   ,updated_by			= @user_id
			   ,updated_date		= GETDATE();

RETURN @id;
END;


