
CREATE PROCEDURE [dbo].[afcs_consumer_qr_balance_sel]  
(  
	@hash_key NVARCHAR(MAX)
	, @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	BEGIN
		SELECT 
			IIF(is_active = 'Y', 'Y', 'N') AS is_valid
			, IIF(is_active = 'Y', 'QR code is valid.', 'QR code is no longer valid.') AS msg
			, IIF(is_active = 'Y', balance_amt, 0) AS current_balance
		FROM dbo.generated_qrs 
		WHERE 1 = 1 
		AND hash_key = @hash_key
	END
END;