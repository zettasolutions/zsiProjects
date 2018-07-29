

CREATE PROCEDURE [dbo].[purchase_upd] (
 @purchase_id			int				= NULL
,@player_id				nvarchar(100)   
,@purchase_amount		decimal(18,2)   
,@service_charge_pct    decimal(18,2)   
,@service_charge_amt    decimal(18,2)   
,@total_amount			decimal(18,2)   
,@transaction_id		nvarchar(1000)  
,@transaction_status	nvarchar(500)   
,@transaction_info		nvarchar(max)   
,@is_served             CHAR(1) = 'N'
,@user_id               INT=null
)
AS
BEGIN
IF ISNULL(@purchase_id,0)=0 AND ISNULL(@player_id,'')<>''
	INSERT INTO dbo.purchases (
	player_id
	,purchase_date
	,purchase_amount
	,service_charge_pct
	,service_charge_amt
	,total_amount
	,transaction_id
	,transaction_status
	,transaction_info
	,is_served
	) VALUES (
	 @player_id
	,GETDATE()
	,@purchase_amount
	,@service_charge_pct
	,@service_charge_amt
	,@total_amount
	,@transaction_id
	,@transaction_status
	,@transaction_info
	,'N'
	)
ELSE
   UPDATE dbo.purchases SET is_served=@is_served, updated_by = @user_id, updated_date=GETDATE() WHERE purchase_id=@purchase_id; 
END

--select * from dbo.purchases
