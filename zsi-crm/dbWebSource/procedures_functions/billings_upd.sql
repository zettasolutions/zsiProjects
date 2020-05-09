
CREATE PROCEDURE [dbo].[billings_upd]
(
    @tt    billings_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 
	   	     billing_date			= b.billing_date	
			,billing_class_id		= b.billing_class_id
			,is_posted				= b.is_posted
	   	    ,updated_by				= @user_id
			,updated_date			= GETDATE()

       FROM dbo.billings a INNER JOIN @tt b
	     ON a.billing_period_id = b.billing_period_id
	     WHERE (
			isnull(b.is_edited,'')  <> ''
		);
-- Insert Process
	INSERT INTO billings(
         billing_date
		,billing_class_id
		,is_posted
		,created_by
		,created_date
    )
	SELECT 
		 billing_date
		,billing_class_id
		,is_posted
	    ,@user_id
	    ,GETDATE()
	FROM @tt 
	WHERE billing_period_id IS NULL
	AND billing_date IS NOT NULL
	AND billing_class_id IS NOT NULL




