



CREATE PROCEDURE [dbo].[device_terms_upd]
(
    @tt    device_terms_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 
	   	     device_model_id		= b.device_model_id	
			,term_id				= b.term_id
			,base_monthly_amount	= b.base_monthly_amount
			,interest_amount		= b.interest_amount
			,total_monthly_amount	= b.total_monthly_amount

       FROM dbo.device_terms a INNER JOIN @tt b
	     ON a.dm_term_id = b.dm_term_id
	     WHERE (
			isnull(b.is_edited,'')  <> ''
		);
-- Insert Process
	INSERT INTO device_terms(
         device_model_id
		,term_id
		,base_monthly_amount
		,interest_amount
		,total_monthly_amount
    )
	SELECT 
		 device_model_id
		,term_id
		,base_monthly_amount
		,interest_amount
		,total_monthly_amount
	FROM @tt 
	WHERE dm_term_id IS NULL
	AND device_model_id IS NOT NULL
	AND term_id IS NOT NULL
	AND base_monthly_amount IS NOT NULL







