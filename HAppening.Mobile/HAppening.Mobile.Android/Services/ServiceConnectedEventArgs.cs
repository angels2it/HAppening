using System;
using Android.OS;

namespace HAppening.Mobile.Droid.Services
{
	public class ServiceConnectedEventArgs : EventArgs
	{
		public IBinder Binder { get; set; }
	}
}